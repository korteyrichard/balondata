<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OrderStatusSyncService
{
    private $moolreSmsService;

    public function __construct()
    {
        $this->moolreSmsService = new MoolreSmsService();
    }

    public function syncOrderStatuses()
    {
        $processingOrders = Order::whereIn('status', ['pending', 'processing'])->with('user')->get();
        
        foreach ($processingOrders as $order) {
            try {
                $this->syncJaybartOrderStatus($order);
            } catch (\Exception $e) {
                Log::error('Failed to sync order status', ['orderId' => $order->id, 'error' => $e->getMessage()]);
            }
        }
    }

    private function syncJaybartOrderStatus($order)
    {
        $orderId = $order->id;
        
        Log::info('Order status sync attempt', [
            'order_id' => $orderId,
            'current_status' => $order->status
        ]);

        try {
            Log::info('Making API call to fetch order details', [
                'order_id' => $orderId,
                'api_endpoint' => '/transactions/' . $orderId
            ]);
            
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.order_pusher.api_key'),
                'Accept' => 'application/json',
                'Content-Type' => 'application/json'
            ])->timeout(20)->get(config('services.order_pusher.base_url') . '/transactions/' . $orderId);

            Log::info('API response received', [
                'order_id' => $orderId,
                'status_code' => $response->status(),
                'response_body' => $response->body(),
                'is_successful' => $response->successful()
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                if (isset($data['success']) && $data['success'] && isset($data['data']['status'])) {
                    $externalStatus = $data['data']['status'];
                    $newStatus = $this->mapExternalStatus($externalStatus);
                    
                    Log::info('Status mapping', [
                        'order_id' => $orderId,
                        'external_status' => $externalStatus,
                        'mapped_status' => $newStatus,
                        'current_order_status' => $order->status
                    ]);
                    
                    if ($newStatus && $newStatus !== $order->status) {
                        $oldStatus = $order->status;
                        $updateResult = $order->update(['status' => $newStatus]);
                        Log::info('Order status updated', [
                            'orderId' => $orderId, 
                            'oldStatus' => $oldStatus, 
                            'newStatus' => $newStatus,
                            'update_successful' => $updateResult
                        ]);
                        
                        // Send SMS notification if order is completed
                        if ($newStatus === 'completed' && $order->user && $order->user->phone) {
                            try {
                                $message = "Your order #{$orderId} for {$order->network} data has been completed successfully. Thank you for using Sharpdatagh!";
                                $smsResult = $this->moolreSmsService->sendSms($order->user->phone, $message);
                                Log::info('SMS notification sent for completed order', [
                                    'order_id' => $orderId,
                                    'phone' => $order->user->phone,
                                    'sms_success' => $smsResult
                                ]);
                            } catch (\Exception $e) {
                                Log::error('Failed to send SMS notification', ['order_id' => $orderId, 'error' => $e->getMessage()]);
                            }
                        }
                    } else {
                        Log::info('Order status unchanged', [
                            'order_id' => $orderId,
                            'current_status' => $order->status,
                            'external_status' => $externalStatus,
                            'mapped_status' => $newStatus
                        ]);
                    }
                } else {
                    Log::warning('Invalid API response format', [
                        'order_id' => $orderId,
                        'response' => $response->json()
                    ]);
                }
            } else {
                Log::warning('API call unsuccessful', [
                    'order_id' => $orderId,
                    'status_code' => $response->status(),
                    'response' => $response->body()
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Order status sync failed', ['orderId' => $orderId, 'error' => $e->getMessage()]);
        }
    }



    private function mapExternalStatus($externalStatus)
    {
        Log::info('Status mapping debug', [
            'input_status' => $externalStatus,
            'input_type' => gettype($externalStatus),
            'input_lowercased' => strtolower($externalStatus)
        ]);
        
        $statusMap = [
            'successful' => 'completed',
            'completed' => 'completed',
            'delivered' => 'completed',
            'processing' => 'processing',
            'pending' => 'processing',
            'failed' => 'cancelled',
            'cancelled' => 'cancelled'
        ];

        $lowercaseStatus = strtolower($externalStatus);
        $mappedStatus = $statusMap[$lowercaseStatus] ?? null;
        
        Log::info('Status mapping result', [
            'original_status' => $externalStatus,
            'lowercase_status' => $lowercaseStatus,
            'mapped_status' => $mappedStatus,
            'available_mappings' => array_keys($statusMap)
        ]);

        return $mappedStatus;
    }
}