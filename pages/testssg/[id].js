import { useRouter } from "next/router";
import Image from "next/image";
import _ from "lodash";

const Post = ({ data }) => {
    // const router = useRouter();
    // const { id } = router.query;

    return (
        <div>
            <h2>{data.name}</h2>
            <div>height: {data.height}</div>
            <div>weight: {data.weight}</div>
            <div>
                <Image
                    src={data.sprites.other["official-artwork"].front_default}
                    alt="pokemon pic"
                    height={400}
                    width={400}
                />
            </div>
        </div>
    );
};

export default Post;

export async function getStaticProps(context) {
    const { id } = context.params;
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`).then(
        (data) => data.json()
    );

    return {
        props: { data: res },
    };
}

export async function getStaticPaths() {
    return {
        paths: _.range(1, 20).map((id) => ({ params: { id: id + "" } })), // params 的每個 value 都必須是 string
        fallback: "blocking", // 若超出範圍退化成ssr
    };
}
