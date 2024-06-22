import useFetch from '../../hooks/use-fetch'
import getUrl from '../../utils/get-url'

function ClassStudentOptions({ className, password }: {
    className: string,
    password: string
}) {
    const [options, state] = useFetch<string[]>(getUrl("/class/students/", {
        "class": className,
        password
    }))

    if (state != 1) {
        return <option value="5a">
            Loading...
        </option>
    }

    return options?.map(([studentName]) => {
        return <option value={studentName} key={studentName}>
            {studentName}
        </option>
    })
}

export default ClassStudentOptions