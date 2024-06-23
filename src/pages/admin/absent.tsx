import { useOutletContext } from "react-router-dom"
import useFetch from "../../hooks/use-fetch";
import getUrl from "../../utils/get-url";
import { useEffect } from "react";
import AdminAbsentList from "../../types/admin-absent-list";

export default function AdminAbsent() {
  const password = useOutletContext() as string;
  const [absentList, state, refresh, setData] = useFetch<AdminAbsentList>(getUrl("/admin/absent/", { password }))

  useEffect(() => {
    const interval = setInterval(() => refresh(), 5000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  if (state != 1) {
    return <p>Läd...</p>
  }

  if (!absentList?.length) {
    return <p>
      noch keiner abwesend gemeldet
    </p>
  }

  return absentList?.map(([studentName, _class, absentListFromStudent]) =>
    <div key={studentName}>
      <p className="flex">
        <span>
          <span style={{ marginRight: "10px" }}>
            {_class}
          </span>
          <span>
            {studentName}
          </span>
        </span>
        <button onClick={async () => {
          try {
            const res = await fetch(getUrl("/admin/absent/complete", {
              password,
              class: _class,
              "student-absent": studentName
            }))

            setData(await res.json() as AdminAbsentList)
          } catch (error) {
            alert(error)
          }
        }} type="button" title="fertigstellen" className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
        </button>
      </p>
      <p>
        {absentListFromStudent.map(date => <span key={date} style={{ margin: "10px" }}>
          {date}
        </span>
        )}
      </p>
    </div>
  )
}