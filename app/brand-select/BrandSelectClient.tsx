'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { setBrand } from '@/lib/brand';

export default function BrandSelectClient() {
  const router = useRouter();

  const handleSelect = (brand: 'ringomode' | 'cintasign') => {
    setBrand(brand);
    console.log('Brand selected:', brand);
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Welcome</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Please select your brand to continue
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div onClick={() => handleSelect('ringomode')} className="group cursor-pointer">
            <Card className="transition-all hover:shadow-lg hover:border-primary/50">
              <CardContent className="flex flex-col items-center justify-center p-8">
                <div className="relative w-48 h-24 mb-4">
                  <Image
                    src="/images/ringomode-logo.png"
                    alt="Ringomode DSP"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-primary">
                  Ringomode DSP
                </p>
              </CardContent>
            </Card>
          </div>

          <div onClick={() => handleSelect('cintasign')} className="group cursor-pointer">
            <Card className="transition-all hover:shadow-lg hover:border-primary/50">
              <CardContent className="flex flex-col items-center justify-center p-8">
                <div className="relative w-48 h-24 mb-4">
                  <Image
                    src="/images/cintasign-logo.jpg"
                    alt="Cintasign"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-primary">
                  Cintasign
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}