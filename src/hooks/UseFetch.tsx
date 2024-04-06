import { useState, useEffect } from "react";

const useFetch = (url: string,  options?: Object) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(url, options)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Could not retrieve data");
                }
                return res.json();
            })
            .then((data) => {
                setData(data);
                setIsPending(false);
                setError(null);
            })
            .catch((err) => {
                setIsPending(false);
                setError(err.message);
            });
    }, [url, options]);

    return { data, isPending, error };
};

export default useFetch;
