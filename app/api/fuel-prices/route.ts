export async function GET() {
  try {
    // 오피넷 API - 전국 평균가격 조회
    const response = await fetch(
      'http://www.opinet.co.kr/api/avgAllPrice.do?out=json&code=F250612480',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch fuel prices')
    }

    const data = await response.json()
    
    // 응답 데이터에서 필요한 정보 추출
    if (data.RESULT && data.RESULT.OIL) {
      const oilData = data.RESULT.OIL
      
      // 제품별 가격 정보 매핑
      const prices = {
        gasoline: 0,      // 보통휘발유 (B027)
        premiumGasoline: 0, // 고급휘발유 (B034)
        diesel: 0,        // 자동차용경유 (D047)
        kerosene: 0,      // 실내등유 (C004)
        lpg: 0           // LPG (K015)
      }

      // 제품 코드별 가격 설정
      oilData.forEach((item: any) => {
        switch(item.PRODCD) {
          case 'B027': // 보통휘발유
            prices.gasoline = parseFloat(item.PRICE)
            break
          case 'B034': // 고급휘발유
            prices.premiumGasoline = parseFloat(item.PRICE)
            break
          case 'D047': // 자동차용경유
            prices.diesel = parseFloat(item.PRICE)
            break
          case 'C004': // 실내등유
            prices.kerosene = parseFloat(item.PRICE)
            break
          case 'K015': // LPG
            prices.lpg = parseFloat(item.PRICE)
            break
        }
      })

      return Response.json({
        success: true,
        data: prices,
        lastUpdated: new Date().toISOString()
      })
    } else {
      throw new Error('Invalid response structure')
    }
  } catch (error) {
    console.error('Error fetching fuel prices:', error)
    
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch fuel prices',
        data: {
          gasoline: 1650,      // 기본값
          premiumGasoline: 1850,
          diesel: 1550,
          kerosene: 1300,
          lpg: 900
        }
      },
      { status: 500 }
    )
  }
} 