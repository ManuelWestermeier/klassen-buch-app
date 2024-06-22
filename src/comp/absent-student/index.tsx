import React, { useState } from "react"
import "./index.css"
import getUrl from "../../utils/get-url"
import { AbsentListData } from "../../types/absent-list-data"
import Auth from "../../types/auth"

export function AbsentStudent({ studentName, index, absentList, setAbsent, auth }: {
    studentName: string,
    index: number,
    absentList: string[],
    setAbsent: React.Dispatch<AbsentListData>,
    auth: Auth
}) {
    const [viewAbsentList, setViewAbsentList] = useState(false)

    return (
        <div className="absent-student">
            <p>
                {index + 1}. {studentName}
            </p>
            {viewAbsentList ?
                <p className="absent-list">
                    {absentList.map((date: string) => <span key={date}> | {date} | </span>)}
                </p> :
                <button
                    onClick={() => setViewAbsentList(true)}
                >
                    Fehltage
                </button>
            }
            <button onClick={async e => {
                e.preventDefault()

                try {
                    const res = await fetch(getUrl("/class/students/absent/toggle-absent/", {
                        "student-absent": studentName,
                        class: auth.className,
                        password: auth.password
                    }))

                    const newAbsentData: AbsentListData = await res.json()

                    if (!newAbsentData) return alert("error : " + newAbsentData)

                    setAbsent(newAbsentData);

                } catch (error) { alert(error) }
            }}
                title="löschen"
                className="icon"
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>
            </button>
        </div>
    )
}