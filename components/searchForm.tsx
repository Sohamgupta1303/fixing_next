import React from 'react'
import Form from 'next/form'
import SearchFormReset from './searchFormReset'

const SearchForm = ({query} : {query ?: string}) => {
    return (
        <Form action="/" scroll = {false} className="search-form">
            <input name="query" defaultValue={query} placeholder='search for organizations' className="search-input"/>

            <div className="flex gap-2">
                {query && (
                    <> {/* these are used to group two elements wo making a new one */}
                        <SearchFormReset/>
                        <button type="submit" className="search-btn bg-primary cursor-pointer">
                            →
                        </button>
                    </>
                )}
            </div>
        </Form>
    )
}

export default SearchForm;