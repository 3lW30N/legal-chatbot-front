import Image from "next/image";
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="bg-[#0A0057]">
      <Image
    className="justify-start"
    src="/logooo.png"
    alt="Mon logo"
    width={300}
    height={0}
    priority
    />
    <div className="w-30 absolute top-8 right-15"> 
    <Button size="sm" className="bg-whith text-white hover:bg-[#12006E]" variant="outline">
    Contact
    </Button>
    </div>
    <div className="w-30 absolute top-8 right-40"> 
    <Button size="sm" className="bg-whith text-white hover:bg-[#12006E]" variant="outline">
    About  
    </Button>
    </div>
    <div className=" min-h-screen bg-[#0A0057]">
      <main className="font-playfair text-white text-8xl absolute top-70 left-135">
         CHATBOT
        <div className="flex gap-4 items-center flex-col sm:flex-row">
   
        </div>
        <Button 
          variant="outline"
          size="lg"
          className="w-50 bg-transparent border-2 border-white rounded-none text-white text-xl px-8 py-4 absolute top-30 left-55"
        >
          S'inscrire
        </Button>
        <Button 
          variant="outline"
          size="lg"
          className="w-50 bg-transparent border-2 border-white rounded-none text-white text-xl px-8 py-4 absolute top-30 left-0"
        >
          Se connecter
        </Button>
      </main> 
    </div>
    </div>
  );
};
