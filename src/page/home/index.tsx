import Auth from "../../types/auth"

function Home({ auth }: { auth: Auth }) {
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
        </div>
        <form className="view">
          <section>
            
          </section>
          <button type="submit">
            Hinzufügen
          </button>
        </form>
      </div>
    </>
  )
}

export default Home