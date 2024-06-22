import useFetch from '../../hooks/use-fetch'
import getUrl from '../../utils/get-url'

function ClassOptions() {
    const [options, state] = useFetch<string[]>(getUrl("/classes/"))

    if (state != 1) {
        return <option value="5a">
            Läd...
        </option>
    }

    return options?.map(className => {
        return <option value={className} key={className}>
            {className}
        </option>
    })
}

export default ClassOptions