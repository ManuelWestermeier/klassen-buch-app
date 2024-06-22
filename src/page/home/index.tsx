import { useState, Dispatch } from "react"
import AbsentList from "../../comp/absent-list"
import ClassStudentOptions from "../../comp/class-student-options"
import Auth from "../../types/auth"
import { AbsentListData } from "../../types/absent-list-data"
import getUrl from "../../utils/get-url"

function Home({ auth }: { auth: Auth }) {
  const [setAbsent, setSetAbsent] = useState<Dispatch<AbsentListData>>()

  return (
    <>
      <p>
        Klasse {auth.className}
      </p>
      <div className="view">
        <div className="view">
          <p>
            Heute nicht da:
          </p>
          <AbsentList setSetAbsent={setSetAbsent} className={auth.className} password={auth.password} />
        </div>
        <form className="view" onSubmit={async e => {
          e.preventDefault()
          const form = e.target as HTMLFormElement;
          const fd = new FormData(form)

          try {
            const res = await fetch(getUrl("/class/students/absent/toggle-absent/", {
              "student-absent": fd.get("student-absent") as string
            }))

            const newAbsentData: AbsentListData = await res.json()

            if (!newAbsentData) return alert("error : " + newAbsentData)

            if (setAbsent) {
              setAbsent(newAbsentData);
            }

          } catch (error) { alert(error) }
        }}>
          <select name="student-absent">
            <ClassStudentOptions
              className={auth.className}
              password={auth.password}
            />
          </select>
          <button type="submit">
            Hinzufügen
          </button>
        </form>
      </div>
    </>
  )
}

export default Home