import React, { useEffect, useState } from "react";
import { auth, db } from "./firebaseConnection";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  deleteDoc
} from "firebase/firestore";
import "./App.css"

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

import type { LivroProps } from "./tyoes";

function App() {

  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [idLivro, setIdLivro] = useState('')
  const [user, setUser] = useState(false)
  const [userDetail, setUserDetail] = useState<any>({})
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')


  const [livros, setLivros] = useState<LivroProps[]>([])

  useEffect(() => {
    async function loadBooks() {
      const unsub = onSnapshot(collection(db, 'livros'), (snapshot) => {
        let listaBooks: any = []

        snapshot.forEach((doc) => {
          listaBooks.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,

          })
        })

        setLivros(listaBooks)
      })
    }

    loadBooks();
  }, [])


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

  async function editarLivro() {
    const docRef = doc(db, 'livros', idLivro)
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor
    })
      .then(() => {
        console.log("LIVRO ATUALIZADO")
        setIdLivro('')
        setTitulo('')
        setAutor('')
      })
      .catch(() => {
        console.log("ERRO AO ATUALIZAR O LIVRO")
      })
  }

  async function deletarLivro(id: string) {
    const docRef = doc(db, 'livros', id)
    await deleteDoc(docRef)
  }

  async function cadastrarUsuario() {

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha)
      alert('Usuario Cadastrado')
      console.log(userCredential)
      setEmail('')
      setSenha('')
    } catch (error: any) {
      setEmail('')
      setSenha('')
      alert(error)

      if (error.code === 'auth/weak-password') {
        alert('SENHA FRACA!')
      } else if (error.code === 'auth/invalid-email') {
        alert('EMAIL INVÁLIDO')
      }
    }


  }

  async function logarUsuario() {
    try {
      const userAuth = await signInWithEmailAndPassword(auth, email, senha)

      console.log(userAuth)
      
      setUserDetail({
        uid: userAuth.user.uid,
        email: userAuth.user.email,
      })

      setUser(true)
      setEmail('')
      setSenha('')
    } catch (error) {
      alert('impossivel realizar o login')
    }  
  }

  async function logOut(){
    const response = await signOut(auth)
    setUser(false)
    setUserDetail({})
    console.log(response)
  }


  async function checkUser() {
    // ADICIONAR A FUNÇÃO DE PERMANENCIA DE LOGIN
  }

  return (
    <>
      <h1>TESTANDO</h1>

      {user && <h2>Olá, {userDetail.email}</h2>}

      <div className="container">
        <label>E-mail:</label>
        <input type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          placeholder="E-mail"
        />
        <label>Senha:</label>
        <input type="password" value={senha} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
          placeholder="Senha"
        />

        <button onClick={logarUsuario}>Login</button>
        <button onClick={cadastrarUsuario}>Cadastrar</button>
        <button onClick={logOut}>logout</button>

      </div>

      <hr />

      <div className="container">
        <label>ID do Livro:</label>
        <input type="text" placeholder="Digite o ID o Livro"
          value={idLivro} onChange={(e) => setIdLivro(e.target.value)} />

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
        <br />
        <button onClick={editarLivro}>Atualizar post</button>

        <ul>
          {livros.map(item => (
            <li key={item.id}>
              <p>{item.id}</p>
              <p>{item.titulo}</p>
              <p>{item.autor}</p>
              <button onClick={() => deletarLivro(item.id)}>EXCLUIR</button>
            </li>
          ))}
        </ul>

      </div>
    </>
  )
}

export default App;