"use client";

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    onClose();
    router.push('/pricing');
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-md transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white/95 backdrop-blur-lg shadow-2xl border border-gray-100 transition-all sm:my-8 sm:w-full sm:max-w-md">
                {/* Highlight strip */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-rose-500"></div>
                
                <div className="p-8">
                  <div className="absolute right-0 top-0 pr-4 pt-4">
                    <button
                      type="button"
                      className="rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                      <div className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-4">
                        <SparklesIcon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <Dialog.Title as="h3" className="text-3xl font-extrabold text-gray-900 mb-2">
                      Upgrade to Pro
                    </Dialog.Title>
                    <p className="text-gray-600 text-base">
                      Image tools are available exclusively for Pro users
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                      <h4 className="font-semibold text-gray-900 mb-2">Pro Features Include:</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <span className="text-purple-500 mr-2">✓</span>
                          <span>Access to all image manipulation tools</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-500 mr-2">✓</span>
                          <span>Unlimited usage across all tools</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-500 mr-2">✓</span>
                          <span>Priority support</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-500 mr-2">✓</span>
                          <span>Ad-free experience</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={handleUpgrade}
                      className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-purple-500/20"
                    >
                      Upgrade to Pro
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-3 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                    >
                      Maybe Later
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

