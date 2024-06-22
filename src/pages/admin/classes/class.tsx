import { Link, useOutletContext, useParams } from "react-router-dom";
import getUrl from "../../../utils/get-url";
import useFetch from "../../../hooks/use-fetch";

function AdminClass() {
    const password = useOutletContext() as string;
    const { id } = useParams()
    const [students, state, refresh] = useFetch<string[]>(getUrl("/class/students/", {
        "class": id as string,
        password
    }))

    if (state != 1) {
        return <option value="5a">
            Läd...
        </option>
    }

    return (
        <>
            <h3>
                Klasse {id}
            </h3>
            {students?.map(studentName => {
                return <p key={studentName} className='flex' style={{ justifyContent: "space-between" }}>
                    <span>
                        {studentName}
                    </span>
                    <button title='löschen' type='button' onClick={async e => {
                        e.preventDefault()
                        await fetch(getUrl("/admin/classes/students/delete", { password, studentName, className: id as string }))
                        refresh()
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>
                    </button>
                </p>
            })}
            <fieldset>
                <legend>
                    Schüler hinzufügen
                </legend>
                <form onSubmit={async e => {
                    e.preventDefault()
                    const fd = new FormData(e.target as HTMLFormElement)

                    const studentName = fd.get("student-name") as string

                    await fetch(getUrl("/admin/classes/students/add", { password, studentName, className: id as string }))

                    refresh()
                }}>
                    <input type="text" name="student-name" placeholder="Schülername..." />
                    <button type="submit">
                        Hinzufügen
                    </button>
                </form>
            </fieldset>
        </>
    )
}

export default AdminClass