import { useState, useEffect } from "react";
import { DebounceInput } from "react-debounce-input";
import $ from "jquery";

function App() {
    const [results, setResults] = useState([
        { name: "A" },
        { name: "B" },
        { name: "C" },
        { name: "D" },
        { name: "E" },
    ]);
    const [shownResults, setShownResults] = useState([]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setResults((currentResults) => {
                const [first, ...rest] = currentResults;
                return [...rest, first];
            });
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        setShownResults(results.slice(0, 5));
    }, [results]);

    const handleSearch = (searchedText) => {
        $.ajax({
            url: "https://itunes.apple.com/search",
            crossDomain: true,
            dataType: "jsonp",
            data: {
                term: searchedText,
            },
            method: "GET",
            success: function (data) {
                const uniqueAlbums = Array.from(
                    new Set(data.results.map((data) => data.collectionName))
                );

                const sortedAlbums = uniqueAlbums.sort();
                const firstFiveAlbumns = sortedAlbums
                    .slice(0, 5)
                    .map((collectionName) => {
                        return { collectionName };
                    });

                setResults((currentResults) => {
                    const cleanResults = currentResults.filter(
                        (result) => result.collectionName === undefined
                    );

                    return [...cleanResults, ...firstFiveAlbumns];
                });
            },
        });
    };

    return (
        <div id="band-search-widget">
            <DebounceInput
                minLength={2}
                debounceTimeout={1000}
                placeholder="Search Band"
                onChange={(event) => {
                    handleSearch(event.target.value);
                }}
                className="search-band-input"
            />
            <div id="results">
                {shownResults.map((result, index) => (
                    <div className="result" key={index}>
                        {result.name ? result.name : result.collectionName}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
