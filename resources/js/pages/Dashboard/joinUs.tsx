import DashboardLayout from '../../layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import React from 'react';
import { FaWhatsapp, FaTelegramPlane } from 'react-icons/fa';

export default function JoinUs({ auth }: PageProps) {
    return (
        <DashboardLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Join Us
                </h2>
            }
        >
            <Head title="Join Us" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* WhatsApp Card */}
                        <div className="bg-accent p-6 rounded-lg shadow-2xl border border-border">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="bg-primary text-primary-foreground p-2 rounded">
                                    <FaWhatsapp className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground">
                                    Whatsapp community
                                </h3>
                            </div>
                            <a
                                href="https://whatsapp.com/channel/0029Vb7dV1A0wak0iXvMsh36"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-2 bg-primary hover:bg-primary/80 text-primary-foreground px-4 py-2 rounded-md font-medium"
                            >
                                <span className="mr-1">↗</span> Join Whatsapp community
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
