export default function Footer() {
  return (
    <footer>
      <div className="p-4 flex justify-between items-center">
        <p>&copy; {new Date().getFullYear()} HyDev.</p>
        <div></div>
      </div>
    </footer>
  );
}
