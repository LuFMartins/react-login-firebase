import React, { useState } from "react";
import { db } from "./firebaseConnection";
import { addDoc, collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import "./App.css"

import type { LivroProps } from "./tyoes";

function App() {

  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')

  const [livros, setLivros] = useState<LivroProps[]>([])

  async function handleAdd() {


    // CRIAÇÃO SEM ID ALEATÓRIO
    // try {

    //   if (titulo.trim() === '' || autor.trim() === '') {
    //     throw new Error('Informações inválidas')

    //   }

    //   await setDoc(doc(db, 'livros', 'i823123'), {
    //     titulo: titulo,
    //     autor: autor
    //   })

    //   setTitulo('')
    //   setAutor('')
    //   alert("Dados Registrados no FIRESTORE")

    // } catch (error) {
    //   if (error instanceof Error) {
    //     alert(error.message)
    //   }
    // }


    // CRIAÇÃO COM ID UNICO ALEATÓRIO

    try {

      if (titulo.trim() === '' || autor.trim() === '') {
        throw new Error('Informações inválidas')
      }

      await addDoc(collection(db, 'livros'), {
        titulo: titulo,
        autor: autor
      })

      setTitulo("")
      setAutor("")

    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }

    }


  }

  async function buscarPost() {
    //buscando com ja sabendo o id
    // const postRef = doc(db, 'livros', 'PyBB5bWeCYa6spfJqbvP')

    // await getDoc(postRef)
    // .then((snapshot) => {
    //   setAutor(snapshot.data()?.autor)
    //   setTitulo(snapshot.data()?.titulo)
    // })
    // .catch(() => {
    //   console.log("Deu erro")
    // })

    const postsRef = collection(db, 'livros')
    await getDocs(postsRef)
      .then((snapshot) => {
        let lista: any = []

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          })
        })

        setLivros(lista)
      })
  }

  return (
    <>
      <h1>TESTANDO</h1>

      <div className="container">
        <label>Titulo:</label>
        <textarea
          placeholder="Digite o titulo"
          value={titulo}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTitulo(e.target.value)}
        />

        <label>Autor:</label>
        <input type="text" placeholder="Autor do post" value={autor} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAutor(e.target.value)} />

        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPost}>Buscar Itens</button>

        {livros.map(item => (
          <div key={item.id}>
            <h1>{item.titulo}</h1>
            <p>{item.autor}</p>
          </div>
        ))}

      </div>
    </>
  )
}

export default App;