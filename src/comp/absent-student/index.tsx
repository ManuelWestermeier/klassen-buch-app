import React, { useState } from "react"
import "./index.css"
import getUrl from "../../utils/get-url"
import { AbsentListData } from "../../types/absent-list-data"

export function AbsentStudent({ studentName, index, absentList, setAbsent }: {
    studentName: string,
    index: number,
    absentList: string[],
    setAbsent: React.Dispatch<AbsentListData>
}) {
    const [viewAbsentList, setViewAbsentList] = useState(false)

    return (
        <div key={studentName} className="absent-student">
            <p>
                {index + 1}. {studentName}
            </p>
            {viewAbsentList ?
                <p className="absent-list">
                    {absentList.map((date: string) => <span> | {date} | </span>)}
                </p> :
                <button
                    onClick={() => setViewAbsentList(true)}
                >
                    Fehltage
                </button>
            }
            <button onClick={async e => {
                e.preventDefault()
                const form = e.target as HTMLFormElement;
                const fd = new FormData(form)

                try {
                    const res = await fetch(getUrl("/class/students/absent/toggle-absent/", {
                        "student-absent": fd.get("student-absent") as string
                    }))

                    const newAbsentData: AbsentListData = await res.json()

                    if (!newAbsentData) return alert("error : " + newAbsentData)

                    setAbsent(newAbsentData);

                } catch (error) { alert(error) }
            }}>
                Delete
            </button>
        </div>
    )
}