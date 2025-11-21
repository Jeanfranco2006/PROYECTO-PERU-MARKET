export default function Header() {
  return (
    <header className="w-full bg-black h-16 flex justify-end items-center px-6 shadow-md">
      <span className="text-white font-semibold mr-4">Jean Chamorro</span>
      <img
        src="/perfil.jpg"
        className="w-10 h-10 rounded-full border border-gray-400"
      />
    </header>
  );
}
