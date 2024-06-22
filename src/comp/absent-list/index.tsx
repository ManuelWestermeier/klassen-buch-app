import React, { useEffect } from 'react'
import useFetch from '../../hooks/use-fetch'
import getUrl from '../../utils/get-url'
import { AbsentListData } from '../../types/absent-list-data'
import { AbsentStudent } from '../absent-student'
import Auth from '../../types/auth'

function AbsentList({ className, password, setSetAbsent, auth }: {
    className: string,
    password: string,
    setSetAbsent: React.Dispatch<React.Dispatch<AbsentListData>>,
    auth: Auth
}) {
    const [absent, state, _, setAbsentList] = useFetch<AbsentListData>(getUrl("/class/students/absent/", {
        "class": className,
        password
    }))

    useEffect(() => setSetAbsent(setAbsentList), [setAbsentList])

    if (state !== 1) {
        return <p>Läd...</p>
    }

    return (
        <>
            {absent?.map(([studentName, absentList, isCompleted], index) => <AbsentStudent
                studentName={studentName}
                absentList={absentList}
                index={index}
                setAbsent={setAbsentList}
                key={studentName}
                auth={auth}
                isCompleted={isCompleted}
            />)}
        </>
    )
}

export default AbsentList