import Image from "next/image";
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="bg-[#0c025d]">
      <Image
    className="justify-start"
    src="/logoooo.png"
    alt="logo CB"
    width={300}
    height={0}
    priority
    />
     <Image
    className="absolute top-40 right-130"
    src="/logoo.png"
    alt="logo badinter"
    width={400}
    height={0}
    priority
    />
     <Image
    className="absolute bottom-0 right-0"
    src="/dessin.png"
    alt="dessin en bas"
    width={400}
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
    <div className=" min-h-screen bg-[#0c025d]">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          
        </div>
        <Button 
          variant="outline"
          size="med"
          className="w-50 bg-transparent border-2 border-white rounded-full text-white text-xl px-8 py-4 absolute top-120 left-135"
        >
          Se connecter
        </Button>
        <Button 
          variant="outline"
          size="med"
          className="w-50 bg-transparent border-2 border-white rounded-full text-white text-xl px-8 py-4 absolute top-120 left-195"
        >
          S'inscrire
        </Button>
    </div>
    </div>
  );
};
