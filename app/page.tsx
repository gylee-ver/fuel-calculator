"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Car, Fuel, Phone, MessageCircle, Share2, Calculator, TrendingUp, Zap, RefreshCw, RotateCcw } from "lucide-react"
import Image from "next/image"

// 유가 정보 타입 정의
interface FuelPrices {
  gasoline: number
  premiumGasoline: number
  diesel: number
  kerosene: number
  lpg: number
}

// 제트윙 가격 정책 정의
const jetwingPricing = {
  경차: { count: 4, price: 600000, category: '승용차' },
  소형차: { count: 7, price: 1050000, category: '승용차' },
  중형차: { count: 7, price: 1050000, category: '승용차' },
  대형차: { count: 8, price: 1200000, category: '승용차' },
  소형버스: { count: 7, price: 1400000, category: '상용차' },
  대형버스: { count: 7, price: 1400000, category: '상용차' },
  대형트럭: { count: 9, price: 1800000, category: '상용차' },
}

export default function FuelCalculator() {
  const [currentEfficiency, setCurrentEfficiency] = useState<string>("")
  const [monthlyDistance, setMonthlyDistance] = useState<string>("")
  const [fuelPrice, setFuelPrice] = useState<string>("1650")
  const [fuelType, setFuelType] = useState<string>("gasoline") // 차종 선택 시 자동 설정용
  const [improvementRate, setImprovementRate] = useState<string>("40")
  const [results, setResults] = useState<any>(null)
  const [selectedCar, setSelectedCar] = useState<string>("")
  
  // 실시간 유가 정보 상태
  const [fuelPrices, setFuelPrices] = useState<FuelPrices>({
    gasoline: 1650,
    premiumGasoline: 1850,
    diesel: 1550,
    kerosene: 1300,
    lpg: 900
  })
  const [isLoadingPrices, setIsLoadingPrices] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  // 인기 차종별 기본 연비 데이터 (차량 크기와 제트윙 가격 정보 추가)
  const popularCars = {
    쏘렌토: { efficiency: 12.5, improvement: 40, fuelType: 'diesel', carSize: '중형차' },
    스타리아: { efficiency: 11.8, improvement: 35, fuelType: 'diesel', carSize: '대형차' },
    셀토스: { efficiency: 12.8, improvement: 30, fuelType: 'gasoline', carSize: '소형차' },
    그랜저: { efficiency: 9.8, improvement: 25, fuelType: 'gasoline', carSize: '대형차' },
  }

  // 모든 차종 데이터 (차량 크기와 제트윙 가격 정보 추가)
  const allCars = {
    // 경차
    모닝: { efficiency: 14.5, improvement: 35, fuelType: 'gasoline', carSize: '경차' },
    스파크: { efficiency: 14.2, improvement: 35, fuelType: 'gasoline', carSize: '경차' },
    캐스퍼: { efficiency: 15.8, improvement: 30, fuelType: 'gasoline', carSize: '경차' },
    레이: { efficiency: 14.0, improvement: 35, fuelType: 'gasoline', carSize: '경차' },
    
    // 소형차
    코나: { efficiency: 12.0, improvement: 28, fuelType: 'gasoline', carSize: '소형차' },
    셀토스: { efficiency: 12.8, improvement: 30, fuelType: 'gasoline', carSize: '소형차' },
    아반떼: { efficiency: 15.2, improvement: 20, fuelType: 'gasoline', carSize: '소형차' },
    K3: { efficiency: 14.8, improvement: 22, fuelType: 'gasoline', carSize: '소형차' },
    투싼: { efficiency: 12.5, improvement: 32, fuelType: 'gasoline', carSize: '소형차' },
    
    // 중형차  
    쏘나타: { efficiency: 12.5, improvement: 25, fuelType: 'gasoline', carSize: '중형차' },
    K5: { efficiency: 13.0, improvement: 25, fuelType: 'gasoline', carSize: '중형차' },
    쏘렌토: { efficiency: 12.5, improvement: 40, fuelType: 'diesel', carSize: '중형차' },
    싼타페: { efficiency: 12.2, improvement: 38, fuelType: 'diesel', carSize: '중형차' },
    스포티지: { efficiency: 13.2, improvement: 28, fuelType: 'gasoline', carSize: '중형차' },
    
    // 대형차
    그랜저: { efficiency: 9.8, improvement: 25, fuelType: 'gasoline', carSize: '대형차' },
    K7: { efficiency: 10.2, improvement: 25, fuelType: 'gasoline', carSize: '대형차' },
    K8: { efficiency: 9.5, improvement: 25, fuelType: 'gasoline', carSize: '대형차' },
    스타리아: { efficiency: 11.8, improvement: 35, fuelType: 'diesel', carSize: '대형차' },
    카니발: { efficiency: 9.5, improvement: 30, fuelType: 'diesel', carSize: '대형차' },
  }

  // 실시간 유가 정보 가져오기
  const fetchFuelPrices = async () => {
    setIsLoadingPrices(true)
    try {
      const response = await fetch('/api/fuel-prices')
      const data = await response.json()
      
      if (data.success) {
        setFuelPrices(data.data)
        setLastUpdated(new Date(data.lastUpdated).toLocaleString('ko-KR'))
        
        // 현재 선택된 연료 타입의 가격으로 업데이트
        setFuelPrice(data.data[fuelType].toString())
      }
    } catch (error) {
      console.error('Failed to fetch fuel prices:', error)
    } finally {
      setIsLoadingPrices(false)
    }
  }

  // 연료 타입이 변경될 때 가격 자동 업데이트
  useEffect(() => {
    if (fuelPrices[fuelType as keyof FuelPrices]) {
      setFuelPrice(fuelPrices[fuelType as keyof FuelPrices].toString())
    }
  }, [fuelType, fuelPrices])

  // 컴포넌트 마운트 시 실시간 유가 정보 가져오기
  useEffect(() => {
    fetchFuelPrices()
  }, [])

  const calculateSavings = () => {
    if (!currentEfficiency || !monthlyDistance || !selectedCar) return

    const currentFuelCost =
      (Number.parseFloat(monthlyDistance) / Number.parseFloat(currentEfficiency)) * Number.parseFloat(fuelPrice)
    const improvedEfficiency = Number.parseFloat(currentEfficiency) * (1 + Number.parseFloat(improvementRate) / 100)
    const improvedFuelCost = (Number.parseFloat(monthlyDistance) / improvedEfficiency) * Number.parseFloat(fuelPrice)
    const monthlySavings = currentFuelCost - improvedFuelCost
    const yearlySavings = monthlySavings * 12

    // 제트윙 세트 가격 정보 가져오기 (세트 가격만 사용)
    const carData = allCars[selectedCar as keyof typeof allCars] || popularCars[selectedCar as keyof typeof popularCars]
    const jetwingInfo = jetwingPricing[carData?.carSize as keyof typeof jetwingPricing]
    const jetwingSetPrice = jetwingInfo?.price || 1050000 // 기본값: 소형차/중형차 세트 가격
    
    // 투자 회수 기간 계산 (개월)
    const paybackPeriod = jetwingSetPrice / monthlySavings

    setResults({
      currentFuelCost: Math.round(currentFuelCost / 1000) * 1000,
      improvedFuelCost: Math.round(improvedFuelCost / 1000) * 1000,
      improvedEfficiency: Math.round(improvedEfficiency * 10) / 10,
      monthlySavings: Math.round(monthlySavings / 1000) * 1000,
      yearlySavings: Math.round(yearlySavings / 10000) * 10000,
      savingsPercentage: Math.round((monthlySavings / currentFuelCost) * 100),
      jetwingPrice: jetwingSetPrice, // 세트 가격만 사용
      jetwingCount: jetwingInfo?.count || 7,
      paybackPeriod: Math.round(paybackPeriod * 10) / 10,
      carSize: carData?.carSize || '소형차'
    })
  }

  useEffect(() => {
    if (currentEfficiency && monthlyDistance) {
      calculateSavings()
    } else {
      setResults(null)
    }
  }, [currentEfficiency, monthlyDistance, fuelPrice, improvementRate])

  const selectCar = (carName: string) => {
    const carData = popularCars[carName as keyof typeof popularCars]
    setCurrentEfficiency(carData.efficiency.toString())
    setImprovementRate(carData.improvement.toString())
    setFuelType(carData.fuelType)
    setSelectedCar(carName)
  }

  const handleCarSelect = (carName: string) => {
    if (!carName) return
    const carData = allCars[carName as keyof typeof allCars]
    setCurrentEfficiency(carData.efficiency.toString())
    setImprovementRate(carData.improvement.toString())
    setFuelType(carData.fuelType)
    setSelectedCar(carName)
  }

  const handleDistanceSelect = (distance: string) => {
    setMonthlyDistance(distance)
  }

  // 초기화 함수 추가
  const handleReset = () => {
    setCurrentEfficiency("")
    setMonthlyDistance("")
    setFuelPrice("1650")
    setFuelType("gasoline")
    setImprovementRate("40")
    setResults(null)
    setSelectedCar("")
  }

  const isCalculationReady = currentEfficiency && monthlyDistance

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8 pt-4">
          <div className="mb-4">
            <Image 
              src="/Acro Motors_Symbol.png" 
              alt="아크로모터스 로고" 
              width={96} 
              height={96}
              className="w-48 h-24 object-contain mx-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">연비 절약 계산기</h1>
          <p className="text-gray-600"><strong>제트윙</strong>으로 얼마나 절약할 수 있는지 확인해보세요</p>
          <Badge variant="secondary" className="mt-2">
            <Zap className="w-3 h-3 mr-1" />
            아크로모터스
          </Badge>
        </div>

        {/* 입력 섹션 */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="w-5 h-5 text-blue-600" />
                차량 정보 입력
              </CardTitle>
              {/* 초기화 버튼 */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="h-8 px-3 text-xs flex items-center gap-1 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
              >
                <RotateCcw className="w-3 h-3" />
                초기화
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* 차종 선택 */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-3 block">🚗 차종 선택</Label>
              <div className="space-y-3">
                {/* 인기 차종 */}
                <div className="grid grid-cols-4 gap-2">
                  {Object.keys(popularCars).map((car) => (
                    <Button
                      key={car}
                      onClick={() => selectCar(car)}
                      variant={selectedCar === car ? "default" : "outline"}
                      className={`h-12 text-sm ${
                        selectedCar === car 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                          : 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300'
                      }`}
                    >
                      {car}
                    </Button>
                  ))}
                </div>

                {/* 전체 차종 선택 */}
                <Select onValueChange={handleCarSelect} value={selectedCar}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="다른 차종 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(allCars).map((car) => (
                      <SelectItem key={car} value={car}>
                        {car}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 현재 연비 */}
            <div>
              <Label htmlFor="efficiency" className="text-sm font-semibold text-gray-700 mb-2 block">
                ⛽ 현재 연비 (km/L)
              </Label>
              <Input
                id="efficiency"
                type="number"
                value={currentEfficiency}
                onChange={(e) => setCurrentEfficiency(e.target.value)}
                placeholder="예: 12.5"
                className="h-12 text-lg"
              />
            </div>

            {/* 월 주행거리 */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">📏 월 주행거리 (km)</Label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[
                  { value: "500", label: "500" },
                  { value: "1000", label: "1,000" },
                  { value: "1500", label: "1,500" },
                  { value: "2000", label: "2,000" },
                ].map((dist) => (
                  <Button
                    key={dist.value}
                    onClick={() => handleDistanceSelect(dist.value)}
                    variant={monthlyDistance === dist.value ? "default" : "outline"}
                    className={`h-12 text-sm ${
                      monthlyDistance === dist.value 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                        : 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300'
                    }`}
                  >
                    {dist.label}
                  </Button>
                ))}
              </div>
              <Input
                type="number"
                value={monthlyDistance}
                onChange={(e) => setMonthlyDistance(e.target.value)}
                placeholder="직접 입력"
                className="h-12 text-lg"
              />
            </div>

            {/* 연료 타입 선택 */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-3 block">⛽ 내 차 연료 타입</Label>
              <div className="grid grid-cols-2 gap-2">
                {/* 4개 연료 타입 - 모두 동일한 크기 */}
                <Button
                  onClick={() => setFuelType('gasoline')}
                  variant={fuelType === 'gasoline' ? "default" : "outline"}
                  className={`h-12 text-sm font-medium ${
                    fuelType === 'gasoline' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                      : 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300'
                  }`}
                >
                  휘발유
                </Button>
                <Button
                  onClick={() => setFuelType('diesel')}
                  variant={fuelType === 'diesel' ? "default" : "outline"}
                  className={`h-12 text-sm font-medium ${
                    fuelType === 'diesel' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                      : 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300'
                  }`}
                >
                  경유
                </Button>
                <Button
                  onClick={() => setFuelType('premiumGasoline')}
                  variant={fuelType === 'premiumGasoline' ? "default" : "outline"}
                  className={`h-12 text-sm font-medium ${
                    fuelType === 'premiumGasoline' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                      : 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300'
                  }`}
                >
                  고급휘발유
                </Button>
                <Button
                  onClick={() => setFuelType('lpg')}
                  variant={fuelType === 'lpg' ? "default" : "outline"}
                  className={`h-12 text-sm font-medium ${
                    fuelType === 'lpg' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                      : 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300'
                  }`}
                >
                  LPG
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                💡 선택한 연료 타입의 실시간 가격이 자동으로 적용됩니다
              </p>
            </div>

            {/* 개선율 (숨김 처리 - 자동 설정) */}
            <input type="hidden" value={improvementRate} />
          </CardContent>
        </Card>

        {/* 실시간 유가 정보 카드 */}
        <Card className="mb-6 shadow-lg border-0 bg-gradient-to-r from-blue-50 to-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <Fuel className="w-5 h-5 text-blue-600" />
                실시간 유가 정보
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchFuelPrices}
                disabled={isLoadingPrices}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingPrices ? 'animate-spin' : ''}`} />
              </Button>
            </CardTitle>
            {lastUpdated && (
              <p className="text-xs text-gray-500">마지막 업데이트: {lastUpdated}</p>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            {/* 주요 연료 2개 - 상단에 크게 표시 */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white rounded-lg p-4 border-2 border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-gray-700 font-medium text-sm">휘발유</p>
                </div>
                <p className="font-bold text-lg text-blue-600">{fuelPrices.gasoline.toLocaleString()}<span className="text-sm font-normal ml-1">원/L</span></p>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-gray-700 font-medium text-sm">경유</p>
                </div>
                <p className="font-bold text-lg text-green-600">{fuelPrices.diesel.toLocaleString()}<span className="text-sm font-normal ml-1">원/L</span></p>
              </div>
            </div>

            {/* 나머지 연료 2개 - 하단에 작게 표시 */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-lg p-3">
                <p className="text-gray-600 text-xs mb-1">고급휘발유</p>
                <p className="font-bold text-sm">{fuelPrices.premiumGasoline.toLocaleString()}<span className="text-xs ml-1">원/L</span></p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-gray-600 text-xs mb-1">LPG</p>
                <p className="font-bold text-sm">{fuelPrices.lpg.toLocaleString()}<span className="text-xs ml-1">원/L</span></p>
              </div>
            </div>

            <div className="text-xs text-gray-500 mt-3 text-center">
              📊 한국석유공사 오피넷 제공
            </div>
          </CardContent>
        </Card>

        {/* 결과 섹션 */}
        {isCalculationReady && results ? (
          <Card className="mb-6 shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-green-700">
                <TrendingUp className="w-5 h-5" />🚀 제트윙 장착 시 절약 효과
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 제트윙 상품 정보 */}
              <div className="bg-white rounded-xl p-5 shadow-sm border-2 border-blue-100">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />💎 제트윙 세트 ({results.carSize})
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600 mb-1">제트윙 개수</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {results.jetwingCount}
                      <span className="text-sm font-normal ml-1">개</span>
                    </p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600 mb-1">제트윙 세트 가격</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {(results.jetwingPrice / 10000).toFixed(0)}
                      <span className="text-sm font-normal ml-1">만원</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* 연비 개선 효과 */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-blue-600" />⚡ 제트윙 장착 시 연비 향상
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">현재 연비</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {currentEfficiency}
                      <span className="text-sm font-normal ml-1">km/L</span>
                    </p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600 mb-1">장착 후 연비</p>
                    <p className="text-2xl font-bold text-green-600">
                      {results.improvedEfficiency}
                      <span className="text-sm font-normal ml-1">km/L</span>
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    ⬆️ {improvementRate}% 연비 향상
                  </Badge>
                </div>
              </div>

              {/* 월간/연간 절약 효과 */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">💰 연료비 절약 효과</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-600 mb-1">현재 월 연료비</p>
                      <p className="text-xl font-bold text-red-600">
                        {results.currentFuelCost.toLocaleString()}
                        <span className="text-sm font-normal ml-1">원</span>
                      </p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 mb-1">장착 후 월 연료비</p>
                      <p className="text-xl font-bold text-blue-600">
                        {results.improvedFuelCost.toLocaleString()}
                        <span className="text-sm font-normal ml-1">원</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <p className="text-sm text-green-600 mb-2">💵 월간 절약액</p>
                    <p className="text-3xl font-bold text-green-600 mb-2">
                      {results.monthlySavings.toLocaleString()}
                      <span className="text-lg font-normal ml-1">원</span>
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      연간 {Math.round(results.yearlySavings / 10000)}만원 절약
                    </p>
                  </div>
                </div>
              </div>

              {/* 투자 회수 기간 */}
              <div className="bg-white rounded-xl p-5 shadow-sm border-2 border-orange-100">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-orange-600" />⏰ 투자 회수 기간
                </h3>
                <div className="text-center">
                  <p className="text-4xl font-bold text-orange-600 mb-2">
                    {results.paybackPeriod < 12 
                      ? `${results.paybackPeriod.toFixed(1)}개월`
                      : `${(results.paybackPeriod / 12).toFixed(1)}년`
                    }
                  </p>
                  <p className="text-sm text-gray-600">
                    제트윙 구매 비용을 모두 회수하는 기간
                  </p>
                  {results.paybackPeriod <= 24 && (
                    <Badge variant="default" className="mt-2 bg-green-600">
                      💪 빠른 투자 회수!
                    </Badge>
                  )}
                </div>
              </div>

              {/* 절약 진행률 */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">📊 연료비 절약률</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">절약률</span>
                    <span className="font-bold text-green-600">{results.savingsPercentage}%</span>
                  </div>
                  <Progress value={results.savingsPercentage} className="h-3" />
                  <p className="text-xs text-gray-500 text-center">
                    매월 연료비 {results.savingsPercentage}% 절약 효과
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 shadow-lg border-0 border-dashed border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Calculator className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-700 mb-2">절약 효과를 확인해보세요</h3>
              <p className="text-gray-500 text-sm">
                차량 정보와 주행거리를 입력하시면
                <br />
                예상 절약 금액을 계산해드립니다
              </p>
            </CardContent>
          </Card>
        )}

        {/* CTA 버튼 */}
        <div className="space-y-4 mb-8">
          <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-6 text-lg rounded-xl shadow-lg flex items-center justify-center gap-3">
            <MessageCircle className="w-6 h-6" />
            제트윙 무료 상담받기
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="py-4 rounded-xl flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              전화 상담
            </Button>
            <Button variant="outline" className="py-4 rounded-xl flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              결과 공유
            </Button>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="text-center text-xs text-gray-500 pb-8">
          <p className="font-medium">아크로모터스</p>
          <p>충청남도 천안시 서북구 직산읍 상덕로 141</p>
          <p className="mt-2">© 2024 아크로모터스. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
