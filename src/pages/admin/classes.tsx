import { useOutletContext } from 'react-router-dom';

export default function AdminClasses() {
  const password = useOutletContext() as string;

  return (
    <div>AdminClasses {password}</div>
  )
}