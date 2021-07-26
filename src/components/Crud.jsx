import React, { useState } from 'react';
import { isCompositeComponentWithType } from 'react-dom/cjs/react-dom-test-utils.development';
import uuid from 'react-uuid'
import Swal from 'sweetalert2'

export const Crud = () => {

    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [edit, setEdit] = useState(false);

    const addTask = () => {
        const task={id:uuid(), title, description}
        setTasks([...tasks, task]);
        clear();
    };

    const updateTask = () => {
        const id = localStorage.getItem('id')
        const newTask = {id, title, description}
        const newTasks = tasks.map(item => item.id === id ? newTask : item)
        setTasks(newTasks)
        clear()
    };

    const actions = (e) => {
        e.preventDefault();
        edit ? updateTask() : addTask();
    };

    const deleteTask = (id) => {

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success me-2',
              cancelButton: 'btn btn-danger me-2'
            },
            buttonsStyling: false
          })
          
          swalWithBootstrapButtons.fire({
            title: 'Seguro desea eliminar la tarea?',
            text: "Recuerde que al eliminarla nunca la podrá recuperar",
            icon: 'danger',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'No, cancelar',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
                const newTask = tasks.filter(task => task.id !== id);
                setTasks(newTask);
                Swal.fire({
                    title: 'Tarea Eliminada!',
                    text: 'Su tarea ha sido eliminada',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                }
              )
            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
              Swal.fire({
                  title: 'Cancelado',
                  text: 'Tarea no eliminada',
                  icon: 'warning',
                  showConfirmButton: false,
                  timer: 1500
              } 
              )
            }
        })

        
        
    };

    const getData = (id) => {
        const task = tasks.find(item => item.id === id);
        localStorage.setItem('id', id);
        setTitle(task.title);
        setDescription(task.description);
        setEdit(true);
    };

    const clear = ()=> {
        setTitle('');
        setDescription('');
        setEdit(false);
        localStorage.removeItem('id');
    };

    return (
        <div className='container'>
            <div className='mt-5 justify-content-center d-flex aling-items-center'>
                <div className='col-6'>
                    <div className='card'>
                        <h3 className='card-title text-center m-3'>CRUD</h3>
                        <div className='card-body'>
                            <form onSubmit={actions}>
                                <div className='m-3'>
                                    <input type="text" placeholder='Título' value={title} required autoFocus className='form-control text-center' onChange={e => setTitle(e.target.value)}/>
                                </div>
                                <div className='m-3'>
                                    <input type="text" placeholder='Descripción' value={description} required className='form-control text-center' onChange={e => setDescription(e.target.value)}/>
                                </div>
                                <button className='btn btn-dark form-control' type='submit'>GUARDAR</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        <ul className="list-group list-group-numbered m-3">
            {
                tasks.map(task => (
            <li className="list-group-item d-flex justify-content-between align-items-start" key={task.id}>
                <div className="ms-2 me-auto">
                    <div className="fw-bold">{task.title}</div>
                    {task.description}
                </div>
                <button className='btn btn-danger me-2' onClick = {() => deleteTask(task.id)}><i className="fas fa-trash-alt"></i></button>
                <button className='btn btn-secondary me-2' onClick = {() => getData(task.id)}><i className="fas fa-pen-fancy"></i></button>
            </li>
                ))
            }   
        </ul>
        
        </div>
    )
}
