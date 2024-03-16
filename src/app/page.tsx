'use client';
import { Transition, Dialog } from "@headlessui/react";
import { ImageResponse } from "next/server";
import { Fragment, useEffect, useRef, useState } from "react";

export default function HomePage() {
  const [modal, setModal] = useState(false)
  const [count, setCount] = useState(1)
  const [playerScore, setPlayerScore] = useState(0);

  let currentMultiplier = 1
  const score = 0
  let hasPassed = false

  useEffect(() => {
    const multiplerInterval = setInterval(() => {
      currentMultiplier += 0.0001
    }, 0.0001);

    let currentObsPos = 0
    const screenWidth = window.innerWidth;
    const container = document.getElementById("obsContainer");
    
    const obsCreator = () => {
      const obs = document.createElement("img");
      const image =
        {
          src: '/tower.png',
          height: 96,
          width: 48,
        }
  

      obs.src = image.src;
      obs.id = 'obs'
      obs.className = `h-${image.height} w-${image.width} absolute bottom-0`;
      obs.style.right = `${currentObsPos}px`;
      container?.appendChild(obs);
      return obs;
    }
    const obs1 = obsCreator();
    const randomiseImage = () => {
      const obs = document.getElementById('obs') as HTMLImageElement
      const images = [
        {
          src: '/tower.png',
          height: 96,
          width: 48,
        },
        {
          src: '/ship.png',
          height: 46,
          width: 96,
        }
      ]
      const randomImage = images[Math.floor(Math.random() * images.length)]
      if(obs && randomImage) {
        obs.src = randomImage?.src ?? '/tower.png';
        obs.className = `h-${randomImage.height} w-${randomImage.width} absolute bottom-0`;
      }
    }

    const moveObs = (obs: HTMLImageElement) => {
      if (obs) {
        currentObsPos += 10 * currentMultiplier; 
        if (currentObsPos > screenWidth) {
          hasPassed = false
          randomiseImage()
          currentObsPos = 0;
        }
        obs.style.right = `${currentObsPos}px`;
      }
    };
    const moveInterval = setInterval(() => {
      setTimeout(() => {
        moveObs(obs1);
      }, 3000);
    }
    , 0.1);

    let currentHeight = 0;
    window.addEventListener("keydown", (e) => {
      e.preventDefault();
      if (e.key === " ") {
        if(!modal) {
        setCount(newCount => newCount + 1)
        console.log(count)
        const hamster = document.getElementById("hamster");
        currentHeight += 150;
        hamster?.animate([
          { bottom: `${currentHeight - 100}px` },
          { bottom: `${currentHeight}px` }
        ], {
          duration: 100,
          iterations: 1
        });
      }
    }
    });
    const gravity = () => {
      const hamster = document.getElementById("hamster");
      if (hamster) {
        if (currentHeight < 0) {
          currentHeight = 0;
        }
        currentHeight -= 3;
        hamster.style.bottom = `${currentHeight}px`;
      }
      let hasCollided = false;
      if(hamster) {
        const hBox = hamster.getBoundingClientRect();
        const oBox = obs1.getBoundingClientRect();
        hasCollided = !(hBox.right < oBox.left || 
          hBox.left > oBox.right || 
          hBox.bottom < oBox.top || 
          hBox.top > oBox.bottom)
        if(hBox.right > oBox.left && hBox.left < oBox.right) {
          if(!hasPassed) {
            console.log(score)
            setPlayerScore(playerScore => playerScore + 1);
          }
          hasPassed = true
        }
      }
      if(hasCollided) {
        setModal(true)
        clearInterval(gravityInterval)
        clearInterval(moveInterval)
        clearInterval(multiplerInterval)
      }
    };
    const gravityInterval = setInterval(gravity, 0.1);
    return (
      () => {
        clearInterval(gravityInterval);
        clearInterval(moveInterval);
        clearInterval(multiplerInterval);
        obs1.remove();
      }
    )
  }, []);

  return (
    <>
    <div className="w-screen h-screen bg-gray-400 flex py-40 relative z-20">
      <div className="w-full justify-center z-30 absolute">
        <div className="flex justify-center w-full">
          <h1 className="text-5xl font-bold">Helicopter </h1>
        </div>
        <div className="flex justify-center w-full">
          <p className="text-2xl">Press space to jump</p>
        </div>
        <div className="flex justify-center w-full">
          <p className="text-2xl">Score: {playerScore}</p>
        </div>
      </div>
      <>
      <Transition appear show={modal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    You lost!
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Multiplier: {currentMultiplier}
                    </p>
                    <p className="text-sm text-gray-500">
                      Score: {playerScore}
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setModal(false)}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      </>
      <div className="flex justify-center w-full">
        <img id="hamster" className="w-36 h-36 absolute bottom-0" src={count % 1 == 1 ? '/hamster-fly-1.png' :  '/hamster-fly-2.png'} alt="Hamster" />
      </div>
      <div id="obsContainer"></div>
    </div>
    </>
  );
}
