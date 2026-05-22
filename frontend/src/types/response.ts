import { FullBooking, FullBusiness, FullService, FullUser } from "./models";

import { ApiMessage, ApiResult } from "@/lib/api/api-response";

/**
 *  Message Response
 */

export type MessageResponse = ApiResult<ApiMessage>;

/**
 *  User Response
 */

export type UserResponse = ApiResult<FullUser>;

/**
 *  Owner - Business Response
 */

export type OwnerBusinessResponse = ApiResult<FullBusiness>;
export type OwnerBusinessListResponse = ApiResult<FullBusiness[]>;

/**
 *  Owner - Service Response
 */

export type OwnerServiceResponse = ApiResult<FullService>;

/**
 *  Owner - Booking Response
 */

export type OwnerBookingResponse = ApiResult<FullBooking>;
export type OwnerBookingListResponse = ApiResult<FullBooking[]>;
