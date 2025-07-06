import React from 'react';
import '@material/web/icon/icon.js';
import '@material/web/button/filled-button.js';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isModelLoading: boolean;
    isTranscribing: boolean;
}

export function TranscribeButton(props: Props): JSX.Element {
    const { isModelLoading, isTranscribing, onClick, ...buttonProps } = props;
    return (
        <md-filled-button
            {...buttonProps}
            onClick={(event) => {
                if (onClick && !isTranscribing && !isModelLoading) {
                    onClick(event);
                }
            }}
            disabled={isTranscribing}
            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center'
        >
            {isModelLoading ? (
                <Spinner text={"Loading model..."} />
            ) : isTranscribing ? (
                <Spinner text={"Transcribing..."} />
            ) : (
                "Transcribe Audio"
            )}
        </md-filled-button>
    );
}

export function Spinner(props: { text: string }): JSX.Element {
    return (
        <div role='status' className="flex items-center">
            <md-icon className="animate-spin mr-2">sync</md-icon>
            {props.text}
        </div>
    );
}
