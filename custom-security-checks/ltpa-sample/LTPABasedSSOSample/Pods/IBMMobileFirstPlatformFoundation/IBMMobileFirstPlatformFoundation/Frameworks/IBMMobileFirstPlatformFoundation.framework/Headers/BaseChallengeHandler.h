/**
	Licensed Materials - Property of IBM

	(C) Copyright 2015 IBM Corp.

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

//  BaseChallengeHandler.h
//  WorklightStaticLibProject
//
//  Created by Ishai Borovoy on 9/12/12.
//
//  Base class for all challenge handlers.
//

#import <Foundation/Foundation.h>
#import "WLResponse.h"

@class WLRequest;

@interface BaseChallengeHandler : NSObject {
    @private
    NSString *securityCheck;
    
    @protected
    WLRequest *activeRequest;
    NSMutableArray *waitingRequestsList;
}

@property (nonatomic, strong) NSString *securityCheck;
@property (atomic, strong) WLRequest *activeRequest;
@property (atomic, strong) NSMutableArray *waitingRequestsList;

-(id) initWithSecurityCheck: (NSString *) securityCheck;
-(void) handleChallenge: (NSDictionary *)challenge;
-(void) submitFailure: (WLResponse *)challenge;

-(void) releaseWaitingList;
-(void) clearWaitingList;

@end
