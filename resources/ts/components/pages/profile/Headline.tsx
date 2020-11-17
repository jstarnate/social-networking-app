import React, { FC, ReactElement } from 'react';
import MaleDefaultAvatar from 'helpers/MaleDefaultAvatar';

const Headline: FC = (): ReactElement => {
    return (
        <section className='pd-t--lg pd-l--sm pd-r--sm'>
            {/* Basic info and follow/unfollow button */}
            <div className='d--flex ai--center'>
                <div className='d--flex ai--center'>
                    <MaleDefaultAvatar size={100} />

                    <div className='mg-l--sm'>
                        <span className='d--block font--lg text--black text--bold'>
                            John Doe
                        </span>
                        <span className='font--md text--gray'>@john.doe</span>
                    </div>
                </div>

                <button className='btn btn--primary-o font--md text--bold pd-t--xs pd-b--xs pd-l--lg pd-r--lg mg-l--auto profile__follow-button'>
                    Follow
                </button>
            </div>

            {/* Bio */}
            <p className='font--md text--black-light mg-t--sm'>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </p>

            {/* Location, birth date, and date joined */}
            <div className='mg-t--sm'>
                <label className='font--md text--gray'>
                    <i className='fa fa-map-marker'></i>
                    <span className='mg-l--xxs'>Philippines</span>
                </label>

                <label className='font--md text--gray mg-l--lg'>
                    <i className='fa fa-gift'></i>
                    <span className='mg-l--xxs'>March 12, 1986</span>
                </label>

                <label className='font--md text--gray mg-l--lg'>
                    <i className='fa fa-calendar'></i>
                    <span className='mg-l--xxs'>August 2020</span>
                </label>
            </div>

            {/* Followers and following users */}
            <div className='mg-t--sm'>
                <button className='btn font--md'>
                    <span className='text--black-light text--bold'>10</span>
                    <span className='text--gray mg-l--xxs'>following</span>
                </button>

                <button className='btn font--md mg-l--lg'>
                    <span className='text--black-light text--bold'>14</span>
                    <span className='text--gray mg-l--xxs'>followers</span>
                </button>
            </div>
        </section>
    );
};

export default Headline;
