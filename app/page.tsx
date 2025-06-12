"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Car, Fuel, Phone, MessageCircle, Share2, Calculator, TrendingUp, Zap } from "lucide-react"

export default function FuelCalculator() {
  const [currentEfficiency, setCurrentEfficiency] = useState<string>("")
  const [monthlyDistance, setMonthlyDistance] = useState<string>("")
  const [fuelPrice, setFuelPrice] = useState<string>("1650")
  const [improvementRate, setImprovementRate] = useState<string>("40")
  const [results, setResults] = useState<any>(null)
  const [selectedCar, setSelectedCar] = useState<string>("")

  // 인기 차종별 기본 연비 데이터
  const popularCars = {
    쏘렌토: { efficiency: 12.5, improvement: 40 },
    스타리아: { efficiency: 11.8, improvement: 35 },
    셀토스: { efficiency: 12.8, improvement: 30 },
    그랜저: { efficiency: 9.8, improvement: 25 },
  }

  // 모든 차종 데이터
  const allCars = {
    쏘렌토: { efficiency: 12.5, improvement: 40 },
    스타리아: { efficiency: 11.8, improvement: 35 },
    셀토스: { efficiency: 12.8, improvement: 30 },
    그랜저: { efficiency: 9.8, improvement: 25 },
    스포티지: { efficiency: 13.2, improvement: 28 },
    카니발: { efficiency: 9.5, improvement: 30 },
    투싼: { efficiency: 12.5, improvement: 32 },
    싼타페: { efficiency: 12.2, improvement: 38 },
    K5: { efficiency: 13.0, improvement: 25 },
    아반떼: { efficiency: 15.2, improvement: 20 },
    코나: { efficiency: 12.0, improvement: 28 },
  }

  const calculateSavings = () => {
    if (!currentEfficiency || !monthlyDistance) return

    const currentFuelCost =
      (Number.parseFloat(monthlyDistance) / Number.parseFloat(currentEfficiency)) * Number.parseFloat(fuelPrice)
    const improvedEfficiency = Number.parseFloat(currentEfficiency) * (1 + Number.parseFloat(improvementRate) / 100)
    const improvedFuelCost = (Number.parseFloat(monthlyDistance) / improvedEfficiency) * Number.parseFloat(fuelPrice)
    const monthlySavings = currentFuelCost - improvedFuelCost
    const yearlySavings = monthlySavings * 12

    setResults({
      currentFuelCost: Math.round(currentFuelCost / 1000) * 1000,
      improvedFuelCost: Math.round(improvedFuelCost / 1000) * 1000,
      improvedEfficiency: Math.round(improvedEfficiency * 10) / 10,
      monthlySavings: Math.round(monthlySavings / 1000) * 1000,
      yearlySavings: Math.round(yearlySavings / 10000) * 10000,
      savingsPercentage: Math.round((monthlySavings / currentFuelCost) * 100),
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
    setSelectedCar(carName)
  }

  const handleCarSelect = (carName: string) => {
    if (!carName) return
    const carData = allCars[carName as keyof typeof allCars]
    setCurrentEfficiency(carData.efficiency.toString())
    setImprovementRate(carData.improvement.toString())
    setSelectedCar(carName)
  }

  const handleDistanceSelect = (distance: string) => {
    setMonthlyDistance(distance)
  }

  const isCalculationReady = currentEfficiency && monthlyDistance

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8 pt-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">연비 절약 계산기</h1>
          <p className="text-gray-600">제트윙으로 얼마나 절약할 수 있는지 확인해보세요</p>
          <Badge variant="secondary" className="mt-2">
            <Zap className="w-3 h-3 mr-1" />
            아크로모터스
          </Badge>
        </div>

        {/* 입력 섹션 */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="w-5 h-5 text-blue-600" />
              차량 정보 입력
            </CardTitle>
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
                      className="h-10 text-sm"
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
                    className="h-12"
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

            {/* 유가 */}
            <div>
              <Label htmlFor="fuel-price" className="text-sm font-semibold text-gray-700 mb-2 block">
                💰 현재 유가 (원/L)
              </Label>
              <Input
                id="fuel-price"
                type="number"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(e.target.value)}
                className="h-12 text-lg"
              />
            </div>

            {/* 개선율 (숨김 처리 - 자동 설정) */}
            <input type="hidden" value={improvementRate} />
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
                <div className="text-center mt-3">
                  <Badge variant="secondary" className="text-blue-600">
                    +{improvementRate}% 향상
                  </Badge>
                </div>
              </div>

              {/* 월간 절약 효과 */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">💰 제트윙 장착 시 월간 기름값 절약</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">현재 월 기름값</span>
                    <span className="font-semibold text-red-600 text-lg">
                      {results.currentFuelCost.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">장착 후 월 기름값</span>
                    <span className="font-semibold text-blue-600 text-lg">
                      {results.improvedFuelCost.toLocaleString()}원
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-800">월 절약액</span>
                      <span className="font-bold text-green-600 text-xl">
                        {results.monthlySavings.toLocaleString()}원
                      </span>
                    </div>
                    <Progress value={results.savingsPercentage} className="h-3 mb-1" />
                    <p className="text-xs text-right text-gray-500">기존 대비 {results.savingsPercentage}% 절약</p>
                  </div>
                </div>
              </div>

              {/* 연간 절약 효과 */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white text-center">
                <h3 className="font-semibold mb-2">🎯 제트윙 장착 시 연간 총 절약액</h3>
                <p className="text-4xl font-bold mb-2">{results.yearlySavings.toLocaleString()}원</p>
                <p className="text-green-100 text-sm">1년간 절약할 수 있는 금액</p>
              </div>

              {/* 투자 회수 기간 */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">⏱️ 제트윙 투자 회수 기간</h3>
                    <p className="text-sm text-gray-600">제트윙 설치 비용 기준</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-blue-600">
                      {Math.ceil(1500000 / results.monthlySavings)}개월
                    </span>
                    <p className="text-sm text-gray-500">약 150만원 기준</p>
                  </div>
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
