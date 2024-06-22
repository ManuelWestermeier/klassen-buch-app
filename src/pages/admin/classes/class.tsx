import { useOutletContext, useParams } from "react-router-dom";

function AdminClass() {
    const password = useOutletContext() as string;
    const { id } = useParams()

    return (
        <div>
            <h3>
                Klasse {id}
            </h3>
            <form>
                <input type="text" />
            </form>
        </div>
    )
}

export default AdminClass