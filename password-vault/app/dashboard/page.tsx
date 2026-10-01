'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase-browser'

export default function Dashboard(){
 const supabase=createClient(); const [email,setEmail]=useState(''); const [loading,setLoading]=useState(true)
 useEffect(()=>{supabase.auth.getUser().then(({data})=>{setEmail(data.user?.email??'');setLoading(false)})},[])
 if(loading)return <main className="center"><div className="loader"/></main>
 return <main className="shell"><aside><div className="brand"><span>◈</span> Vault</div><nav><a className="active">▣ Cofre</a><a>★ Favoritos</a><a>⚙ Configurações</a></nav><button className="logout" onClick={async()=>{await supabase.auth.signOut();location.href='/'}}>Sair</button></aside><section className="content"><header><div><p className="eyebrow">COFRE PESSOAL</p><h1>Suas senhas</h1><p className="muted">{email||'Faça login para acessar seu cofre.'}</p></div><button className="primary">+ Nova senha</button></header><div className="notice"><strong>🔐 Camada de segurança</strong><span>Os dados do cofre serão criptografados no seu navegador antes de serem enviados ao Supabase.</span></div><div className="empty"><div className="lock">⌁</div><h2>Seu cofre está pronto</h2><p>Na próxima etapa vamos configurar a senha mestra, o Google Login e o primeiro registro criptografado.</p></div></section></main>
}
