import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function BecomeAnAgent() {
    const { data, setData, post, processing, errors } = useForm({
        amount: 40
    });

    const handleBecomeAgent = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('become_a_dealer.update'));
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Head title="Become an Agent" />
            <div className="w-full max-w-sm">
                <div className="bg-card rounded-lg shadow-2xl p-8 border border-border">
                    <div className="flex flex-col items-center mb-8">
                        <img src='/balondata.jpeg' alt="BalonData" className="w-40 h-20 mb-6 rounded-lg" />
                        <h1 className="text-2xl font-bold text-foreground text-center">
                            Become an Agent
                        </h1>
                        
                    </div>
                    <form onSubmit={handleBecomeAgent} className="space-y-4">
                        <input type="hidden" name="amount" value="40" />
                        <Button 
                            className="w-full bg-primary hover:bg-primary/80 text-primary-foreground py-3 rounded-md font-medium transition-colors" 
                            disabled={processing}
                        >
                            {processing ? 'Processing...' : 'Pay GHS 40.00 to Become an Agent'}
                        </Button>
                        {errors.message && <div className="text-red-500 text-xs mt-1">{errors.message}</div>}
                    </form>
                    <div className="mt-6 text-center">
                        <div className="text-sm">
                            <span className="mx-2 text-muted-foreground">•</span>
                            <Link href="/" className="text-primary hover:underline">Home</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
