<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OrderPusherService
{
    private $baseUrl;
    private $apiKey;

    public function __construct()
    {
        $this->baseUrl = config('services.order_pusher.base_url', 'https://opendatagh.com/api/v1');
        $this->apiKey = config('services.order_pusher.api_key');
    }

    public function pushOrderToApi(Order $order)
    {
        Log::info('Processing order for API push', ['order_id' => $order->id]);
        
        $items = $order->products()->withPivot('quantity', 'price', 'beneficiary_number', 'product_variant_id')->get();
        Log::info('Order has items', ['count' => $items->count()]);
        
        $hasSuccessfulResponse = false;
        $hasFailedResponse = false;

        foreach ($items as $item) {
            Log::info('Processing item', ['name' => $item->name]);
            
            $beneficiaryPhone = $item->pivot->beneficiary_number;
            $variant = \App\Models\ProductVariant::find($item->pivot->product_variant_id);
            $size = $variant && isset($variant->variant_attributes['size']) ? $variant->variant_attributes['size'] : null;
            $networkId = $this->getNetworkIdFromProduct($item->name);
            
            Log::info('Item details', [
                'product' => $item->name,
                'beneficiary' => $beneficiaryPhone,
                'size' => $size,
                'network_id' => $networkId
            ]);

            if (empty($beneficiaryPhone) || !$networkId || !$size) {
                Log::warning('Missing required order data', [
                    'order_id' => $order->id,
                    'item_id' => $item->id
                ]);
                $hasFailedResponse = true;
                continue;
            }

            $endpoint = $this->baseUrl . '/normal-orders';
            $payload = [
                'beneficiary_number' => $this->formatPhone($beneficiaryPhone),
                'network_id' => $networkId,
                'size' => $size
            ];
            
            Log::info('Sending to API', ['endpoint' => $endpoint, 'payload' => $payload]);

            try {
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json'
                ])->timeout(30)->post($endpoint, $payload);

                Log::info('API Response', [
                    'status_code' => $response->status(),
                    'body' => $response->body()
                ]);

                if ($response->successful()) {
                    $responseData = $response->json();
                    if (isset($responseData['order']['reference_id'])) {
                        $order->update(['reference_id' => $responseData['order']['reference_id']]);
                        Log::info('Reference ID saved', [
                            'order_id' => $order->id,
                            'reference_id' => $responseData['order']['reference_id']
                        ]);
                    }
                    $hasSuccessfulResponse = true;
                } else {
                    $hasFailedResponse = true;
                }

            } catch (\Exception $e) {
                Log::error('API Error', ['message' => $e->getMessage()]);
                $hasFailedResponse = true;
            }
        }
        
        if ($hasSuccessfulResponse && !$hasFailedResponse) {
            $order->update(['api_status' => 'success']);
        } elseif ($hasFailedResponse) {
            $order->update(['api_status' => 'failed']);
        }
    }
    
    private function formatPhone($phone)
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);
        
        if (strlen($phone) == 10 && substr($phone, 0, 1) == '0') {
            return $phone;
        }
        
        return $phone;
    }
    
    private function getNetworkIdFromProduct($productName)
    {
        $productName = strtolower($productName);
        
        if (stripos($productName, 'mtn') !== false) {
            return 9;
        } elseif (stripos($productName, 'telecel') !== false) {
            return 10;
        } elseif (stripos($productName, 'ishare') !== false) {
            return 11;
        } elseif (stripos($productName, 'bigtime') !== false) {
            return 12;
        }
        
        return null;
    }
}