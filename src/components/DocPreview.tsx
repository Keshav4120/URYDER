import React from 'react'

function DocPreview({ label, url }: any) {
    const isPdf = url?.toLowerCase().endsWith(".pdf")
    const isImage = !isPdf && url.toLowerCase().match(/\.(jpg|jpeg|png|webp)$/i)


    return (
        <div className='bg-gray-50 rounded-2xl border overflow-hidden shadow-sm'>
            <div className='px-4 py-2 border-b text-sm font-semibold '>
                {label}
            </div>
            <div className='h-52 flex items-center justify-center bg-white'>
                {!url && <span className='text-gray-400 text-xs'>Image Not Uploaded</span>}
                {isImage && <img src={url} alt={label} className='w-full h-full object-cover' />}
                {isPdf && <iframe src={url} className='w-full h-full' />}

            </div>
            {url && (
                <a href={url} target="_blank" rel="noopener noreferrer"
                    className='block text-center text-xs py-2 font-medium hover:bg-gray-100'>
                    View Full Document
                </a>
            )}
        </div>
    )
}

export default DocPreview