import icon from "/icon.png"

function Heading() {
  return (
    <div className="flex gap-4 items-center w-full border-b border-slate-300 pb-4 text-xl font-bold text-slate-700">
      <img src={icon} />
      Note Keeping
    </div>
  )
}

export default Heading
