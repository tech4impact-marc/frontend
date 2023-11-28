export interface ImageInfo {
  fileUrl: string
  provider: string
  createdDateTime: string
  modifiedDateTime: string
}

export interface Author {
  id: number
  nickname: string
  provider: string
  profile: {
    thumbnailImageUrl: string
    profileImageUrl: string
    profileImageType: string
    isDefaultImage: boolean
  }
}

interface MainInfo {
  observedDateTime: string
  location: {
    latitude: string
    longitude: string
    address: string
    addressDetail: string
  }
  images: ImageInfo[]
}

export interface ReportContentResponse {
  id: number
  reportTypeVersion: {
    id: number
    reportType: {
      id: number
      label: string
      title: string
      subtitle: string
      description: string
    }
    versionNumber: number
  }
  createdDateTime: string
  modifiedDateTime: string
  mainInfo: MainInfo
  author: Author
  post: {
    id: number
    liked: boolean
  }
}

export interface UserReport {
  totalNumberOfPages: number
  totalNumberOfElements: number
  first: boolean
  last: boolean
  isEmpty: boolean
  numberOfElements: number
  contents: ReportContentResponse[]
}

export interface reportGeoJson {
  type: 'Feature'
  properties: {
    id: number
    address: string
    address_detail: string
    image_list: ImageInfo[]
    report_type: number
    year: number
    month: number
    day: number
    post_id: number
    liked: boolean
  }
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
}

export interface typeToReportCollectionGeoJson {
  [type: number]: reportGeoJson[]
}
