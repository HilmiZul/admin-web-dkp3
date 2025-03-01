import { supabaseClient, withPageAuth } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useState } from "react";
import Nav from "../../components/Nav";
import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { convertFromRaw, convertToRaw } from "draft-js";

const Editor = dynamic(() => import("react-draft-wysiwyg").then((mod) => mod.Editor), { ssr: false });

export default function Tambah() {
  const [nama, setNama] = useState();
  // const [foto, setFoto] = useState()
  const [isi, setIsi] = useState();
  const [Kategori, setKategori] = useState();

  const namaStateChange = (event) => {
    setNama(event.target.value);
  };

  // const fotoStateChange = ( event ) => {
  //     setFoto(event.target.files[0])
  // }

  const isiStateChange = (event) => {
    setIsi(event);
  };

  const kategoriStateChange = (event) => {
    setKategori(event.target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    // kita masukin ke supabase
    let deskripsi = draftToHtml(convertToRaw(isi.getCurrentContent()));
    const { data, error } = await supabaseClient.from("Produk").insert([{ nama: nama, deskripsi: deskripsi, foto: "-", id_Kategori: Kategori }]);
  };

  return (
    <>
      <Nav />
      <section>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h3>
                Informasi - Tambah
                <Link href="/informasi">
                  <a className="btn btn-danger ms-2">Kembali</a>
                </Link>
              </h3>
              <form onSubmit={onSubmit}>
                <input type="text" onChange={namaStateChange} placeholder="Tulis Nama Item..." className="form-control form-control-lg mb-3" />
                {/* <input
                                type="file"
                                accept="image/*"
                                onChange={fotoStateChange}
                            /> */}
                <select onChange={kategoriStateChange} value={Kategori} className="form-select form-lg mb-3">
                  <option value="">Pilih Kategori</option>
                  <option value="2">Sayuran</option>
                  <option value="3">Buah-Buahan</option>
                  <option value="1">Rempah-Rempah</option>
                </select>
                <Editor
                  editorState={isi}
                  onEditorStateChange={isiStateChange}
                  wrapperClassName="wrapper-class"
                  editorClassName="editor-class"
                  toolbarClassName="toolbar-class"
                  editorStyle={{
                    border: "2px solid #eaeaea",
                    marginBottom: "20px",
                    height: "200px",
                  }}
                />
                <button type="submit" className="btn btn-success">
                  Simpan
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export const getServerSideProps = withPageAuth({ redirectTo: "/signin" });
