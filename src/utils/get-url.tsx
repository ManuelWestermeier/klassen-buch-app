import { apiUrl } from "../data";

export default function getUrl(path: string, search?: Record<string, string>) {
    const url = new URL(apiUrl)

    url.pathname = path

    if (search)
        Object.keys(search).forEach(key => {
            url.searchParams.set(key, search[key])
        })

    return url.toString()
}