/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState  } from 'react';
import { fabric } from "fabric";
import { ImUndo2, ImRedo2 } from 'react-icons/im';
import cloneDeep from 'lodash/cloneDeep';

const Canvas = () => {
    const canvas = useRef(null);
    const [color, setcolor] = useState('#000000');
    const [wallcolor, setwallcolor] = useState('#ffffff');
    // const [isRedoing, setisRedoing] = useState(false);
    const [width, setwidth] = useState(1);
    const [history] = useState([]);
    const [copy, setcopy] = useState({objects: [], backgroundColor: null});

    const H = window.innerHeight;
    const W = window.innerWidth;
    const margin = 0.9;
    const buttonsSpace = 10/12;
    const isHeigher = (H-W) > 0;
    const length = isHeigher ? W * margin * buttonsSpace : H * margin;

    console.log(H, W)

    const initCanvas = () => (
        new fabric.Canvas('canvas', {
        height: length,
        width: length,
        backgroundColor: 'white',
        selection: false,
        renderOnAddRemove: true,
        isDrawingMode: true,
        preserveObjectStacking: true
        })
    )
    const deleteCanvas = () => {
        canvas.current.dispose();
        canvas.current = null;
    }
    const onClickClear = () => {
        setcopy({
            objects: cloneDeep(canvas.current._objects),
            backgroundColor: `${canvas.current.backgroundColor}`
        });
        canvas.current._objects = [];
        canvas.current.renderAll();

        // DELETE
        // deleteCanvas();
        // INIT
        // canvas.current = initCanvas();
        onChangeWidth(1);
        onChangeColor('#000000');
        onChangeWallColor('#ffffff');
    }
    const onChangeWidth = (value) => {
        setwidth(value);
        canvas.current.freeDrawingBrush.width = parseInt(value, 10) || 1;
    }
    const onChangeColor = (value) => {
        setcolor(value);
        canvas.current.freeDrawingBrush.color = value;
    }
    const onChangeWallColor = (value) => {
        setwallcolor(value);
        canvas.current.setBackgroundColor(value);
        canvas.current.renderAll();
    }
    const onClickSave = () => {
        var saveButton = document.getElementById("save");
        saveButton.href = canvas.current.toDataURL({
            format: "png",
            quality: 0.8
        });
    }
    const undo = () => {
        if (canvas.current._objects.length>0) {
            history.push(canvas.current._objects.pop());
            canvas.current.renderAll();
        }
        // undo new drawing
        else if (copy.objects.length>0 || copy.backgroundColor) {
            canvas.current._objects = cloneDeep(copy.objects);
            canvas.current.setBackgroundColor(copy.backgroundColor);
            canvas.current.renderAll();
            setcopy({objects: [], backgroundColor: null});
            setwallcolor(copy.backgroundColor || "#ffffff");
        }
    }
    const redo = () => {
        if (history.length>0) {
            // setisRedoing(true);
            canvas.current.add(history.pop());
        }
    }

    useEffect(() => {
        canvas.current = initCanvas();
        // canvas.current.on("mouse:over", () => {console.log("mouse over")});
        // canvas.current.on("object:added", (event) => {
            // if(!isRedoing) sethistory([]);
            // setisRedoing(false);
        // });
        return () => {
            deleteCanvas(); 
        };
    }, [])


const grid = isHeigher ? 'grid-y' : 'grid-x';

  return (
    <div className={`${grid} align-middle align-center align-middle grid-margin-x`}>
        <div className="cell small-2 grid-y grid-margin-y grid-padding-x">
            <button className="button" onClick={onClickClear}>Nouveau dessin</button>
            <div style={{padding:"0"}} className="cell grid-x align-justify">
                <button style={{backgroundColor:"blue"}} className="cell small-5 button" onClick={undo}>
                    <ImUndo2 />
                </button>
                <button style={{backgroundColor:"blue"}} className="cell small-5 button" onClick={redo}>
                    <ImRedo2 />
                </button>
            </div>
            <label style={{color:'white', textAlign:'left'}}>
                Couleur
            </label>
            <input 
                onChange={(e) => onChangeColor(e.target.value)} 
                type="color" 
                value={color} 
                id="drawing-color"
                style={{cursor:'pointer'}}
            />
            <label style={{color:'white', textAlign:'left'}}>
                Fond
            </label>
            <input 
                onChange={(e) => onChangeWallColor(e.target.value)} 
                type="color" 
                value={wallcolor} 
                id="drawing-wall-color"
                style={{cursor:'pointer'}}
            />
            <label style={{color:'white', textAlign:'left'}}>
                Épaisseur
            </label>
            <input 
                onChange={(e) => onChangeWidth(e.target.value)} 
                min={1} 
                max={100} 
                type="range" 
                value={width} 
                id="drawing-width"
                style={{cursor:'pointer'}}
            />
            <a style={{marginTop: '4rem', backgroundColor:"orange"}} className="cell button" download="canvas.png" href="#" id="save">
                <button 
                style={{cursor:'pointer', color:'black'}} 
                id="lnkDownload" 
                onClick={onClickSave}>
                    Télécharger
                </button>
            </a>
        </div>
        
        <div className="cell shrink">
            <canvas id="canvas" />
        </div>
    </div>

  );
}

  /*
<input onChange={handleImage} id="imageLoader" type="file" name="imageLoader" />

  const handleImage = (e) => {
      var objects = canvas.current.getObjects();
      for (var i in objects) {
      objects[i].remove();
      }
      var reader = new FileReader();
      
      reader.onload = function (event) {
          var img = new Image();
          img.onload = function () {
              var imgInstance = new fabric.Image(img, {
              selectable: 1
              })
              canvas.current.add(imgInstance);
              canvas.current.deactivateAll().renderAll();
          }
          img.src = event.target.result;
      }
      reader.readAsDataURL(e.target.files[0]);
  }*/

export default Canvas;