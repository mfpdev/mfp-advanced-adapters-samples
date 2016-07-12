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
    NSString *handlerName;
    
    @protected
    WLRequest *activeRequest;
    NSMutableArray *waitingRequestsList;
}

@property (nonatomic, strong) NSString *handlerName;
@property (atomic, strong) WLRequest *activeRequest;
@property (atomic, strong) NSMutableArray *waitingRequestsList;

/**
 * Initialize a challenge with an arbitrary handler name. If the challenge comes from a security check, the handler name must match the security check name.
 *
 * @param name an arbitrary name for this challenge handler.
 */
-(id)initWithName: (NSString *)name;

/**
 * Calling this method tells MobileFirst Platform that the challenge that you no longer want to take any actions to attempt to resolve the challenge.
 * This method returns control to MobileFirst Platform for further handling. For example, call this method when the user clicks on a cancel button.
 */
-(void) cancel;

-(void) handleChallenge: (NSDictionary *)challenge;
-(void) releaseWaitingList;
-(void) clearWaitingList;

@end
