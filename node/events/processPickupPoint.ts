/* eslint-disable @typescript-eslint/ban-ts-comment */
import { InnoshipSchedule } from '../middlewares/utils/InnoshipSchedule'

export async function processPickupPoint(
  ctx: any,
  next: () => Promise<any>
) {
  try {
    const { body, clients: {catalogApi} } = ctx
    const { location } = body

    const workingHours = location.schedule.map((item: InnoshipSchedule) => {
      
      return {
        closingTime: item.closingHour,
        dayOfWeek: item.day === 7 ? 0 : item.day,
        openingTime: item.openingHour,
      }
    })

    const tags = ['innoship pickup', `innoship courier ${location.courierId}`]

    if (location.supportedPaymentType.indexOf('Card') !== -1) {
      tags.push('card')
    } else {
      tags.push('nocard')
    }

    const data = {
      address: {
        city: location.localityName,
        complement: location.courierId,
        country: {
          acronym: 'ROU',
          name: 'Romania',
        },
        location: {
          latitude: location.lat,
          longitude: location.long,
        },
        neighborhood: location.localityId,
        postalCode: location.postalCode,
        state: location.countyName,
        street: location.addressText,
      },
      businessHours: workingHours,
      description: location.supportedPaymentType.indexOf('Card') !== -1  ? 'POS' : '',
      formatted_address: location.addressText,
      id: location.id,
      instructions: location.supportedPaymentType.indexOf('Card') !== -1  ? 'POS' : '',
      isActive: location.isActive,
      isThirdPartyPickup: true,
      name: location.name,
      tagsLabel: tags,
    }
    console.log('Save to catalog');
    catalogApi.saveInnoshipLocationsToCatalog(ctx, data);

    await next()
  } catch (exception) {
    throw exception
  }
}
