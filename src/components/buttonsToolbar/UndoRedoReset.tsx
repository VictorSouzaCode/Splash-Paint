import { useDispatch } from "react-redux"


const UndoRedoReset = () => {

  return (
    <>
    <div className="flex justify-around">
      <button
        className="rounded-md bg-green-300"
        onClick={() => {
          console.log('undo')
        }}
      >Undo</button>
      <button
        className="rounded-md bg-green-300"
        onClick={() => {
          console.log('redo')
        }}
      >Redo</button>
    </div>
      <div>
        <button
        onClick={() => {
          console.log('reset')
        }}
        >Reset</button>
      </div>
    </>
  )
}

export default UndoRedoReset