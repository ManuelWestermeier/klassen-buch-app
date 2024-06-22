import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import useFetch from '../../../hooks/use-fetch';
import getUrl from '../../../utils/get-url';

export default function AdminClasses() {
  const password = useOutletContext() as string;
  const [classes, state, refresh] = useFetch<string[]>(getUrl("/classes/"))
  const navigate = useNavigate()

  if (state != 1) {
    return <option value="5a">
      Läd...
    </option>
  }

  return <>
    {classes?.map(className => {
      return <p key={className} className='flex' style={{ justifyContent: "space-between" }}>
        <Link to={`/admin/classes/${className}`} className='btn'>
          <span>
            {className}
          </span>
        </Link>
        <button title='löschen' type='button' onClick={async e => {
          e.preventDefault()
          await fetch(getUrl("/admin/classes/delete", { password, className }))
          refresh()
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>
        </button>
      </p>
    })}
    <fieldset>
      <legend>
        Klasse hinzufügen
      </legend>
      <form onSubmit={async e => {
        e.preventDefault()
        const fd = new FormData(e.target as HTMLFormElement)

        const className = fd.get("class-name") as string

        await fetch(getUrl("/admin/classes/add", { password, className }))

        refresh()

        navigate(`/admin/classes/${className}`)
      }}>
        <input type="text" name='class-name' placeholder='Klassenname...' />
        <button type='submit'>
          GO
        </button>
      </form>
    </fieldset>
  </>
}