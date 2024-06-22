import { Dispatch, useCallback, useEffect, useState } from "react";
import useLocalStorage from "use-local-storage";

export default function useFetch<T>(url: string): [T | null, number, () => Promise<void>, Dispatch<T | null>] {
    const [data, setData] = useLocalStorage<T | null>("fetch-" + url, null);
    const [state, setState] = useState(0);

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                setState(2);
                return;
            }
            const result: T = await response.json();
            setData(result);
            setState(1);
        } catch (error) {
            console.error('Fetch error:', error);
            setState(2);
        }
    }, [setData, setState, url]);

    useEffect(() => {
        fetchData();
    }, [url]);

    return [data, state, fetchData, setData];
}