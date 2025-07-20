"use client" //needs this because we use features/"browser API's" like
             //document, form.reset and onClick.

import React from 'react'

const SearchFormReset = () => {
    const reset = () => {
        const form = document.querySelector('.search-form') as HTMLFormElement
        if (form) {
            form.reset()
        }
    }
    return (
        <button type='reset' onClick={reset} className="search-btn cursor-pointer">
            X
        </button>
    )
}

export default SearchFormReset
