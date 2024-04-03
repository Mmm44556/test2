

export function useDirectory(setDirName, setHoverEdited, forwardDir) {

  const getLayer = (file, path) => () => {
    if (file.type === 'file') return;
    file.bg = false;
    file.selected=false;
    const copy = [...path];
    copy.push(file.filename)
    const pathString = copy.join('\\')
    setDirName({ api: `layer.php/?folderName=${pathString}`, folderName: file.filename })

    forwardDir(file.filename, file.id)
  }
  //hover顯示編輯
  const mouseEnter = (id) => () => {
    setHoverEdited(v => {
      v[id].selected = true;
      return [...v];
    })
  }
  const mouseLeave = (id) => () => {
    setHoverEdited(v => {
      v[id].selected = false;
      v[id].bg = false;
      return [...v];
    })
  }
  //focus顯示選取提示
  const focus = (id) => () => {
    setHoverEdited(v => {
      v[id].bg = true;
      return [...v];
    })
  }
  const blur = (id) => () => {

    setHoverEdited(v => {
      v[id].bg = false;
      return [...v];
    })
  }

  return { getLayer, mouseEnter, mouseLeave, focus, blur }
}