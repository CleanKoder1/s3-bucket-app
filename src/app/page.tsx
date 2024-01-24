"use client"

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Image from "next/image";

export default function Home() {
  const [image, setImage] = useState<string>();
  const [selectedImage, setSelectedImage] = useState<File>();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage)
        const headers = {
          "Content-Type": "multipart/form-data"
        }

        const { data } = await axios.post("/api/s3", formData, { headers })
        if (data.success)
          setImage(data.data.url)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleFileChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files && ev.target.files[0];
    if (file)
      setSelectedImage(file)
  }
  return (
    <main className="flex w-screen h-screen flex-col gap-3 items-center justify-center">
      {
        image && <Image alt={image} src={image} height={200} width={200}
          className="rounded-md" />
      }
      <form onSubmit={onSubmit} className="flex flex-col gap-3 w-50">
        <label htmlFor="image" className="font-medium">Selecciona tu imagen</label >
        <Input id="image" type="file" onChange={handleFileChange} />
        <Button type="submit" className="w-100">Submit</Button>
      </form>
    </main>
  );
}
