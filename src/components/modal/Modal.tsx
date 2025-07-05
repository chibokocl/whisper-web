import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export interface Props {
    show: boolean;
    onClose: () => void;
    onSubmit: () => void;
    submitText?: string;
    submitEnabled?: boolean;
    title: string | JSX.Element;
    content: string | JSX.Element;
}

export default function Modal({
    show,
    onClose,
    onSubmit,
    title,
    content,
    submitText,
    submitEnabled = true,
}: Props) {
    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as='div' className='relative z-10' onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                >
                    <div className='fixed inset-0 bg-black bg-opacity-25' />
                </Transition.Child>

                <div className='fixed inset-0 overflow-y-auto'>
                    <div className='flex min-h-full items-center justify-center p-4 text-center'>
                        <Transition.Child
                            as={Fragment}
                            enter='ease-out duration-300'
                            enterFrom='opacity-0 scale-95'
                            enterTo='opacity-100 scale-100'
                            leave='ease-in duration-200'
                            leaveFrom='opacity-100 scale-100'
                            leaveTo='opacity-0 scale-95'
                        >
                            <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle kauli-shadow-xl transition-all'>
                                <Dialog.Title
                                    as='h3'
                                    className='text-[var(--font-h3)] font-semibold text-[var(--text-primary)] mb-4'
                                >
                                    {title}
                                </Dialog.Title>
                                <div className='text-[var(--font-body)] text-[var(--text-secondary)]'>
                                    {content}
                                </div>

                                <div className='mt-6 flex flex-row-reverse space-x-3 space-x-reverse'>
                                    {submitText && (
                                        <button
                                            type='button'
                                            disabled={!submitEnabled}
                                            className={`inline-flex justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                                                submitEnabled
                                                    ? "bg-[var(--primary-orange)] text-white hover:bg-[var(--primary-orange)]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-orange)] focus-visible:ring-offset-2"
                                                    : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] cursor-not-allowed"
                                            }`}
                                            onClick={onSubmit}
                                        >
                                            {submitText}
                                        </button>
                                    )}
                                    <button
                                        type='button'
                                        className='inline-flex justify-center rounded-lg border border-[var(--border-light)] bg-white px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-blue)] focus-visible:ring-offset-2 transition-all duration-300'
                                        onClick={onClose}
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
