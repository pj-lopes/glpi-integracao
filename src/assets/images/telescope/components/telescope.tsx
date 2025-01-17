import * as React from 'react'
import { SVGProps } from 'react'

const Telescope = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
    <path
      d="M497.705 256.619c0 133.747-108.423 242.17-242.17 242.17-133.747 0-242.17-108.423-242.17-242.17 0-133.747 108.423-242.17 242.17-242.17 133.747 0 242.17 108.423 242.17 242.17Z"
      style={{
        fill: '#585858',
        paintOrder: 'stroke',
        strokeWidth: 26,
        stroke: '#b3b3b3',
      }}
    >
      <title>{'background-circle'}</title>
    </path>
    <path
      d="M440.732 75.285c1.707 4.079 11.384 27.322 21.534 51.702 12.588 30.397 17.839 42.395 17.839 42.395s3.202-4.286 4.455-10.33c6.546-32.349-12.143-73.047-40.508-88.225-2.941-1.518-5.597-2.846-5.976-2.846-.285 0 .948 3.32 2.656 7.304Z"
      style={{
        fill: '#62cbf1',
      }}
    >
      <title>{'glass'}</title>
    </path>
    <path
      d="M898.817 190.054h271.475v97.977H898.817v-97.977Z"
      style={{
        fill: '#e6e6e6',
      }}
      transform="rotate(-22.633 552.133 2145.786)"
    >
      <title>{'telescope-rectangle-1'}</title>
    </path>
    <g fill="#fefefe" transform="matrix(.09487 0 0 -.09487 13.105 499.03)">
      <title>{'stars-grouping'}</title>
      <path
        d="M2426 5010c-3-25-15-126-26-224-11-99-21-181-23-182-1-1-98-13-214-25-284-31-283-34 31-68 98-11 180-22 182-24s15-99 28-216c32-289 33-289 66 19 12 107 23 196 25 198 1 2 98 14 215 27 289 33 289 33-10 65-113 12-206 23-207 24s-11 89-23 196c-25 236-34 277-44 210zM3630 4535c-34-35-34-35 6-75s40-40 79 0 39 40 5 75c-42 43-48 43-90 0zM1237 4362c-37-38-37-38 1-75s38-37 75 1 37 38-1 75-38 37-75-1zM2832 4187c-40-41-40-45 3-87 35-34 35-34 70 0 43 42 43 48 2 88-40 39-36 39-75-1zM1207 3758c-4-18-9-66-13-105-7-82-3-78-109-88-162-14-165-28-12-45 114-12 114-12 124-111 10-96 16-119 30-106 3 4 11 51 16 106 10 99 10 99 124 111 153 17 150 31-12 45-106 10-102 6-109 88-9 97-17 137-26 137-4 0-10-15-13-32zM4049 2594c-34-35-34-35 3-70 46-42 46-42 88 1 34 35 34 35 0 70-42 43-48 43-91-1zM4755 2570c-58-60 10-138 70-80 43 42 43 48 2 88-33 32-33 32-72-8zM1365 2060c-58-60 10-138 70-80 43 42 43 48 2 88-33 32-33 32-72-8zM3130 2035c-34-35-34-35 3-73 37-37 37-37 74 0 37 38 37 38 3 73-19 19-37 35-40 35s-21-16-40-35zM1896 1729c-3-19-12-94-21-168-17-159 7-135-158-153-202-22-202-34 0-55 165-18 140 10 162-182 26-224 28-222 56 28 17 159-7 136 158 154 202 21 202 33 0 55-76 8-139 16-141 17s-11 75-21 164c-20 169-26 195-35 140zM4410 1595c-34-35-34-35 3-73 37-37 37-37 74 0 37 38 37 38 3 73-19 19-37 35-40 35s-21-16-40-35zM432 1537c-40-41-40-45 3-87 35-34 35-34 70 0 43 42 43 48 2 88-40 39-36 39-75-1zM2837 762c-37-38-37-38 1-75 58-56 138 20 82 78-42 43-38 43-83-3z"
        style={{
          fill: '#fff',
        }}
      />
    </g>
    <path
      d="m258.477 248.756-53.242 244.748c6.447 1.38 21.26 4.136 36.088 4.849l22.121-105.43 83.621-1.307 17.765 81.103c8.002-2.959 27.886-16.269 32.038-19.463l-44.859-205.37c-5.029 15.023-11.693 24.613-27.173 32.124l15.229 77.22-68.695.527s14.433-77.625 14.06-77.815c-20.335-10.341-25.637-24.996-26.953-31.186Z"
      style={{
        fill: '#b3b3b3',
      }}
    >
      <title>{'telescope-base'}</title>
    </path>
    <path
      d="M324.397 277.867c5.899-2.725 11.186-6.409 15.813-11.345 4.627-4.935 8.596-11.121 11.855-18.85l2.904 13.528 2.903 13.528c-2.702 5.323-6.752 10.109-11.788 14.155-5.037 4.046-11.058 7.352-17.703 9.714l-3.984-20.73Z"
      style={{
        fill: '#999',
      }}
    >
      <title>{'shadow-telescope-base'}</title>
    </path>
    <path
      d="M282.224 298.486c-5.617-2.115-10.884-4.866-15.811-8.578-4.926-3.712-9.514-8.383-13.773-14.339l2.913-13.401 2.912-13.401c2.793 8.233 6.558 14.407 11.163 19.162 4.607 4.755 10.055 8.09 16.217 10.646l-3.621 19.911Z"
      style={{
        fill: '#999',
      }}
    />
    <path
      d="m127.343 226.059 29.876 71.728 250.379-104.631-9.283-22.442c-.318 4.101-182.343 84.477-214.595 83.774-21.041-.459-42.889-11.262-56.377-28.429Z"
      style={{
        fill: '#ccc',
      }}
    >
      <title>{'shadow-trectangle-1'}</title>
    </path>
    <path
      d="M353.497 235.811a48.404 48.404 0 0 1-48.404 48.404 48.404 48.404 0 0 1-48.404-48.404 48.404 48.404 0 0 1 48.404-48.404 48.404 48.404 0 0 1 48.404 48.404Z"
      style={{
        fill: '#5289e2',
      }}
    >
      <title>{'base-circle-1'}</title>
    </path>
    <path
      d="M329.71 235.935a24.564 24.564 0 0 1-24.564 24.564 24.564 24.564 0 0 1-24.564-24.564 24.564 24.564 0 0 1 24.564-24.564 24.564 24.564 0 0 1 24.564 24.564Z"
      style={{
        fill: '#e6e6e6',
      }}
    >
      <title>{'base-cicle-2'}</title>
    </path>
    <path
      d="M305.429 211.291c-1.71.03-2.521-.226-.159.661 11.067 4.158 13.529 24.818 6.889 36.012-2.751 4.744-9.492 10.946-12.62 11.085-1.196.053-1.909.444.379.948 14.01 3.088 28.489-6.595 29.664-22.041 1.444-18.964-15.162-26.826-24.153-26.665Z"
      style={{
        fill: '#ccc',
      }}
    >
      <title>{'shadow-base-circle-2'}</title>
    </path>
    <path
      d="M251.657 264.123h76.009v136.161h-76.009V264.123Z"
      style={{
        fill: '#5289e2',
      }}
      transform="rotate(-22.633 -138.311 -103.078)"
    >
      <title>{'telescope-rectangle-2'}</title>
    </path>
    <path
      d="M244.477 107.305h73.841v55.317h-73.841v-55.317Z"
      style={{
        fill: '#5289e2',
      }}
      transform="rotate(-22.633 521.573 643.455)"
    >
      <title>{'telescope-rectangle-3'}</title>
    </path>
    <path
      d="M74.186 154.852h22.407v79.829H74.186v-79.829Z"
      style={{
        fill: '#e5e5e6',
      }}
      transform="rotate(-22.633 296.908 304.23)"
    >
      <title>{'telescope-rectangle-4'}</title>
    </path>
    <path
      d="M73.954 57.265h22.337v29.522H73.954V57.265Z"
      style={{
        fill: '#ccc',
      }}
      transform="rotate(-22.633 666.313 229.693)"
    >
      <title>{'shadow-rectangle-4'}</title>
    </path>
    <path
      d="m65.162 268.909 15.553 37.444 68.196-28.474-5.227-12.543c-.158 2.192-34.681 18.175-50.741 17.799-10.477-.245-21.064-5.051-27.781-14.226Z"
      style={{
        fill: '#4379c9',
      }}
    >
      <title>{'shadow-rectangle-3'}</title>
    </path>
    <path
      d="m366.785 94.975 48.368 116.576 50.122-20.961c-39.076 2.3-84.811-62.277-98.49-95.615Z"
      style={{
        fill: '#4379c9',
      }}
    >
      <title>{'shadow-rectangle-2'}</title>
    </path>
  </svg>
)
export default Telescope
