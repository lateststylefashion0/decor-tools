'use client';

import React from 'react';
import RugCalculatorForm from './calculators/RugCalculatorForm';
import CurtainCalculatorForm from './calculators/CurtainCalculatorForm';
import WallArtCalculatorForm from './calculators/WallArtCalculatorForm';
import PaintCalculatorForm from './calculators/PaintCalculatorForm';
import FlooringCalculatorForm from './calculators/FlooringCalculatorForm';
import TileCalculatorForm from './calculators/TileCalculatorForm';
import WallpaperCalculatorForm from './calculators/WallpaperCalculatorForm';
import RecessedLightingCalculatorForm from './calculators/RecessedLightingCalculatorForm';
import BathroomMirrorCalculatorForm from './calculators/BathroomMirrorCalculatorForm';
import RoomSizeCalculatorForm from './calculators/RoomSizeCalculatorForm';
import CeilingFanCalculatorForm from './calculators/CeilingFanCalculatorForm';
import ChandelierCalculatorForm from './calculators/ChandelierCalculatorForm';
import TVSizeCalculatorForm from './calculators/TVSizeCalculatorForm';
import BaseboardCalculatorForm from './calculators/BaseboardCalculatorForm';
import TrimCalculatorForm from './calculators/TrimCalculatorForm';
import CountertopCalculatorForm from './calculators/CountertopCalculatorForm';
import DrywallCalculatorForm from './calculators/DrywallCalculatorForm';
import CarpetCalculatorForm from './calculators/CarpetCalculatorForm';
import WallAreaCalculatorForm from './calculators/WallAreaCalculatorForm';
import SquareFootageCalculatorForm from './calculators/SquareFootageCalculatorForm';

interface DispatcherProps {
  slug: string;
}

export default function CalculatorDispatcher({ slug }: DispatcherProps) {
  switch (slug) {
    case 'rug-size-calculator':
      return <RugCalculatorForm />;
    case 'curtain-size-calculator':
      return <CurtainCalculatorForm />;
    case 'wall-art-size-calculator':
      return <WallArtCalculatorForm />;
    case 'paint-calculator':
      return <PaintCalculatorForm />;
    case 'flooring-calculator':
      return <FlooringCalculatorForm />;
    case 'tile-calculator':
      return <TileCalculatorForm />;
    case 'wallpaper-calculator':
      return <WallpaperCalculatorForm />;
    case 'recessed-lighting-calculator':
      return <RecessedLightingCalculatorForm />;
    case 'bathroom-mirror-size-calculator':
      return <BathroomMirrorCalculatorForm />;
    case 'room-size-calculator':
      return <RoomSizeCalculatorForm />;
    case 'ceiling-fan-size-calculator':
      return <CeilingFanCalculatorForm />;
    case 'chandelier-size-calculator':
      return <ChandelierCalculatorForm />;
    case 'tv-size-calculator':
      return <TVSizeCalculatorForm />;
    case 'baseboard-calculator':
      return <BaseboardCalculatorForm />;
    case 'trim-calculator':
      return <TrimCalculatorForm />;
    case 'countertop-calculator':
      return <CountertopCalculatorForm />;
    case 'drywall-calculator':
      return <DrywallCalculatorForm />;
    case 'carpet-calculator':
      return <CarpetCalculatorForm />;
    case 'wall-area-calculator':
      return <WallAreaCalculatorForm />;
    case 'square-footage-calculator':
      return <SquareFootageCalculatorForm />;
    default:
      return (
        <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
          <p className="text-stone-600">Calculator under maintenance.</p>
        </div>
      );
  }
}
