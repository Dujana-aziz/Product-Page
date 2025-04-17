'use client'

import Image from 'next/image'
import useLocalStorage from '@/hooks/useLocalStorage'
import { useState, useRef, useEffect, useMemo } from 'react'

const ProductImages = () => {
  const imageZoomRef = useRef<HTMLDivElement | null>(null)
  const [index, setIndex] = useState(0)
  const data = useLocalStorage('products', '/products.json')
  // if (index === 0) throw new Error('Test error!')
  const product = data?.[0]
  const images = useMemo(() => {
    return product
      ? [product.image1, product.image2, product.image3, product.image4].filter(
          Boolean
        )
      : []
  }, [product])

  useEffect(() => {
    if (!imageZoomRef.current || images.length === 0) return

    const imageZoom = imageZoomRef.current
    imageZoom.style.setProperty('--image-url', `url(${images[index]})`)

    const handleMouseMove = (event: MouseEvent) => {
      const { offsetX, offsetY } = event
      const x = (offsetX * 100) / imageZoom.offsetWidth
      const y = (offsetY * 100) / imageZoom.offsetHeight

      imageZoom.style.setProperty('--display', 'block')
      imageZoom.style.setProperty('--zoom-x', `${x}%`)
      imageZoom.style.setProperty('--zoom-y', `${y}%`)
    }

    const handleMouseOut = () => {
      imageZoom.style.setProperty('--display', 'none')
    }

    imageZoom.addEventListener('mousemove', handleMouseMove)
    imageZoom.addEventListener('mouseout', handleMouseOut)

    return () => {
      imageZoom.removeEventListener('mousemove', handleMouseMove)
      imageZoom.removeEventListener('mouseout', handleMouseOut)
    }
  }, [images, index])

  if (!data) return <div>Loading...</div>
  return (
    <div className="">
      <div
        id="imageZoom"
        ref={imageZoomRef}
        style={
          {
            '--zoom-x': '0%',
            '--zoom-y': '0%',
            '--display': 'none',
          } as React.CSSProperties
        }
        className="h-[500px] relative overflow-hidden"
      >
        <Image
          src={images[index]}
          alt={`Product Image ${index + 1}`}
          fill
          sizes="50vw"
          className="object-cover rounded-md"
        />
      </div>
      <div className="flex justify-between gap-4 mt-8">
        {images.map((url: string, i: number) => (
          <div
            className="w-1/4 h-32 relative gap-4 mt-8 cursor-pointer"
            key={i}
            onClick={() => setIndex(i)}
          >
            <Image
              src={url}
              alt={`Thumbnail ${i + 1}`}
              fill
              sizes="30vw"
              className="object-cover rounded-md"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between gap-4 mt-8"></div>
    </div>
  )
}

export default ProductImages
